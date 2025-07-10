import { parseGeo, GeoInfo } from './parse';
import fs from 'fs';
import path from 'path';
import type RBush from 'rbush';

export interface Country {
  name: {
    common: string;
    official: string;
    commonArticle: string | null;
    officialArticle: string | null;
  };
  topLevelDomain: string | null;
  currency: {
    code: string;
    name: string;
    singular: string;
    plural: string;
    symbol: string;
  } | null;
  phone: string | null;
  languages: {
    code: string;
    name: string;
    percentage: number | null;
    status: string | null;
  }[];
}

export interface Region {
  name: string;
}

export interface Airport {
  id: string;
  type: string;
  name: string;
  lat: number;
  lon: number;
  elevation_ft: number | null;
  continent: string | null;
  iso_country: string;
  iso_region: string;
  municipality: string | null;
  scheduled_service: string;
  icao_code: string | null;
  iata_code: string | null;
  gps_code: string | null;
  local_code: string | null;
}

interface AirportIndexItem {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  id: string;
}

// --- Create a cache for data ---
let countries: Record<string, Country>;
let regions: Record<string, Region>;
let airports: Record<string, Airport>;
let airportIndex: RBush<AirportIndexItem>;

// --- Create a promise that resolves once all data is loaded at startup ---
const initializationPromise = (async () => {
  try {
    const { default: RBush } = await import('rbush');
    
    // Read all data files when the module first loads
    const countriesData = fs.readFileSync(path.join(__dirname, 'generated/countries.json'), 'utf-8');
    const regionsData = fs.readFileSync(path.join(__dirname, 'generated/regions.json'), 'utf-8');
    const airportsData = fs.readFileSync(path.join(__dirname, 'generated/airports/airports.json'), 'utf-8');
    const airportIndexData = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated/airports/index.json'), 'utf-8'));

    // Parse the data and build the index
    countries = JSON.parse(countriesData);
    regions = JSON.parse(regionsData);
    airports = JSON.parse(airportsData);
    airportIndex = new RBush<AirportIndexItem>().fromJSON(airportIndexData);

    console.log('Locator data initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize locator data:', err);
    process.exit(1); // Exit if data loading fails, as the app can't function
  }
})();

export interface Config {
    //user expandable
    nearbyAirports?: number;
}

export interface VisitorContext extends GeoInfo {
  // ip is now inherited from GeoInfo
  country: Country | null;
  region: Region | null;
  airports: Airport[] | null;
  //headers: Record<string, string | undefined>;
}

// The function must be async to support dynamic imports
export async function resolveVisitorContext(
  input: Request | Headers | Record<string, string | string[] | undefined>,
  opts: Partial<Config> = {},
): Promise<VisitorContext> {
  // Wait for the one-time data load to complete.
  // On subsequent calls, this promise will already be resolved and this will be instant.
  await initializationPromise;

  const headers = input instanceof Request ? input.headers : input;
  const geo = parseGeo(headers);

  const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');

  let nearbyAirports: Airport[] | null = null;
  if (geo.latitude && geo.longitude) {
    const { default: knn } = await import('rbush-knn');
    // The non-null assertion `!` is safe because initializationPromise ensures these are loaded.
    const nearest = knn(airportIndex!, geo.longitude, geo.latitude, opts.nearbyAirports ?? 10);
    
    // --- DIAGNOSTIC LOG ---
    // This loop will check each ID found by the search and log a warning if it's missing from the main data file.
    nearest.forEach(item => {
      if (!airports![item.id]) {
        console.warn(`[vercel-locator] Data integrity issue: Airport ID "${item.id}" was found in the spatial index but is missing from the main airport data file.`);
      }
    });
    
    // Map to airport objects and then filter out any that were not found.
    // This prevents `undefined` values in the final array.
    nearbyAirports = nearest
      .map(item => airports![item.id])
      .filter((airport): airport is Airport => airport !== undefined);
  }

  // Assemble once and return
  return {
    // ip is now included in the ...geo spread
    country: countries![geo.countryCode ?? ''] ?? null,
    region: regionKey ? regions![regionKey] ?? null : null,
    airports: nearbyAirports,
    //headers: Object.fromEntries(headers),
    ...geo
  };
}
