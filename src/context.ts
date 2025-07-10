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

// --- Create a cache for data to avoid reading files on every request ---
let countries: Record<string, Country> | null = null;
let regions: Record<string, Region> | null = null;
let airports: Record<string, Airport> | null = null;
let airportIndex: RBush<AirportIndexItem> | null = null; // This will hold the RBush instance

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
  input: Request | Headers | Record<string, string | undefined>,
  opts: Partial<Config> = {},
): Promise<VisitorContext> {
  // Lazy-load data and modules only on the first invocation
  if (!airportIndex) {
    const { default: RBush } = await import('rbush');
    countries = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated/countries.json'), 'utf-8'));
    regions = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated/regions.json'), 'utf-8'));
    airports = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated/airports/airports.json'), 'utf-8'));
    const airportIndexData = JSON.parse(fs.readFileSync(path.join(__dirname, 'generated/airports/index.json'), 'utf-8'));
    airportIndex = new RBush<AirportIndexItem>().fromJSON(airportIndexData);
  }

  const headers = input instanceof Request ? input.headers : input;
  const geo = parseGeo(headers);

  const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');

  let nearbyAirports: Airport[] | null = null;
  if (geo.latitude && geo.longitude) {
    const { default: knn } = await import('rbush-knn');
    const nearest = knn(airportIndex!, geo.longitude, geo.latitude, opts.nearbyAirports ?? 10);
    nearbyAirports = nearest.map(item => airports![item.id]);
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
