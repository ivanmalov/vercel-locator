import { parseGeo, GeoInfo } from './parse';
import RBush from 'rbush';
import knn from 'rbush-knn';

// Import data directly so it's included in the bundle
import countriesData from './generated/countries.json';
import regionsData from './generated/regions.json';
import airportsData from './generated/airports/airports.json';
import airportIndexData from './generated/airports/index.json';

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
  iata: string | null;
  name: string;
  city: string | null;
  country: string;
  lat: number;
  lon: number;
}

interface AirportIndexItem {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  id: string;
}

const countries: Record<string, Country> = countriesData as Record<string, Country>;
const regions: Record<string, Region> = regionsData as Record<string, Region>;
const airports: Record<string, Airport> = airportsData as Record<string, Airport>;

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
