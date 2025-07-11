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
let icaoMap: Record<string, string>;
let iataMap: Record<string, string>;

// --- Create a promise that resolves once all data is loaded at startup ---
const initializationPromise = (async () => {
  try {
    const { default: RBush } = await import('rbush');
    
    // Read all data files when the module first loads
    const countriesData = fs.readFileSync(path.join(__dirname, 'generated/countries.json'), 'utf-8');
    const regionsData = fs.readFileSync(path.join(__dirname, 'generated/regions.json'), 'utf-8');
    const airportsData = fs.readFileSync(path.join(__dirname, 'generated/airports/airports.json'), 'utf-8');
    const airportIndexData = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated/airports/index.json'), 'utf-8'));
    const icaoMapData = fs.readFileSync(path.join(__dirname, 'generated/airports/icao-map.json'), 'utf-8');
    const iataMapData = fs.readFileSync(path.join(__dirname, 'generated/airports/iata-map.json'), 'utf-8');

    // Parse the data and build the index
    countries = JSON.parse(countriesData);
    regions = JSON.parse(regionsData);
    airports = JSON.parse(airportsData);
    airportIndex = new RBush<AirportIndexItem>().fromJSON(airportIndexData);
    icaoMap = JSON.parse(icaoMapData);
    iataMap = JSON.parse(iataMapData);

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

// --- Direct Lookup Functions ---

/**
 * Looks up a country by its ISO 3166-1 alpha-2 code.
 * @param code The two-letter country code (e.g., "US").
 * @returns A Country object or null if not found.
 */
export async function lookupCountry(code: string): Promise<Country | null> {
  await initializationPromise;
  return countries[code.toUpperCase()] ?? null;
}

/**
 * Looks up a region by its ISO 3166-2 code.
 * @param code The region code (e.g., "US-CA").
 * @returns A Region object or null if not found.
 */
export async function lookupRegion(code: string): Promise<Region | null> {
  await initializationPromise;
  return regions[code.toUpperCase()] ?? null;
}

/**
 * Finds the nearest airport(s) to a given set of coordinates, with an optional filter.
 * @param lat The latitude.
 * @param lon The longitude.
 * @param count The number of airports to return. Defaults to 10.
 * @param filter An optional function to filter the results.
 * @returns An array of Airport objects.
 */
export async function lookupAirportsByCoords(
  lat: number,
  lon: number,
  count: number = 1,
  filter?: (airport: Airport) => boolean
): Promise<Airport[]> {
  await initializationPromise;
  const { default: knn } = await import('rbush-knn');

  // If a filter is provided, we search for more initial candidates (e.g., 50)
  // to ensure we find enough that match the filter criteria.
  const searchCount = filter ? 100000 : count;

  const nearest = knn(airportIndex, lon, lat, searchCount);

  let candidates = nearest
    .map(item => airports[item.id])
    .filter((airport): airport is Airport => airport !== undefined);

  // Apply the user-provided filter if it exists
  if (filter) {
    candidates = candidates.filter(filter);
  }

  // Finally, return the requested number of airports
  return candidates.slice(0, count);
}

/**
 * Looks up an airport by its ICAO code.
 * @param code The 4-letter ICAO code (e.g., "KLAX").
 * @returns An Airport object or null if not found.
 */
export async function lookupAirportByIcao(code: string): Promise<Airport | null> {
  await initializationPromise;
  const airportId = icaoMap[code.toUpperCase()];
  return airportId ? (airports[airportId] ?? null) : null;
}

/**
 * Looks up an airport by its IATA code.
 * @param code The 3-letter IATA code (e.g., "LAX").
 * @returns An Airport object or null if not found.
 */
export async function lookupAirportByIata(code: string): Promise<Airport | null> {
  await initializationPromise;
  const airportId = iataMap[code.toUpperCase()];
  return airportId ? (airports[airportId] ?? null) : null;
}
