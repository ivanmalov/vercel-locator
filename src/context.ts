import { parseGeo, GeoInfo } from './parse';
import fs from 'fs';
import path from 'path';
import RBush from 'rbush';
import knn from 'rbush-knn';

// Import data directly so it's included in the bundle
import countriesData from './generated/countries.json';
import regionsData from './generated/regions.json';
import airportsData from './generated/airports/airports.json';
import { data as airportIndexBase64 } from './generated/airports/index';
import airportIndexIds from './generated/airports/index-ids.json';

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

const countries: Record<string, Country> = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'generated/countries.json'), 'utf-8')
);
const regions: Record<string, Region> = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'generated/regions.json'), 'utf-8')
);
const airports: Record<string, Airport> = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'generated/airports/airports.json'), 'utf-8')
);
const airportIndexData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'generated/airports/index.json'), 'utf-8')
);

const airportIndex = new RBush<AirportIndexItem>().fromJSON(airportIndexData);

export interface Config {
    //user expandable
    nearbyAirports?: number;
}

export interface VisitorContext extends GeoInfo {
  ip: string | null;
  country: Country | null;
  region: Region | null;
  airports: Airport[] | null;
  //headers: Record<string, string | undefined>;
}

export function resolveVisitorContext(
  input: Request | Headers,
  opts: Partial<Config> = {},
): VisitorContext {
  const headers = input instanceof Request ? input.headers : input;
  const geo = parseGeo(headers);

  const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');

  let nearbyAirports: Airport[] | null = null;
  if (geo.latitude && geo.longitude) {
    const nearest = knn(airportIndex, geo.longitude, geo.latitude, opts.nearbyAirports ?? 10);
    nearbyAirports = nearest.map(item => airports[item.id]);
  }

  // Assemble once and return
  return {
    ip: headers.get('x-real-ip') ?? null,
    country: countries[geo.countryCode ?? ''] ?? null,
    region: regionKey ? regions[regionKey] ?? null : null,
    airports: nearbyAirports,
    //headers: Object.fromEntries(headers),
    ...geo
  };
}
