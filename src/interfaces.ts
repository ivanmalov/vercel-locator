export interface GeoInfo {
  ip: string | null;
  continentCode: string | null;
  countryCode: string | null;
  regionCode: string | null;
  city: string | null;
  postalCode: string | null;
  longitude: number | null;
  latitude: number | null;
  timezone: string | null;
}

export interface CurrencyDetails {
  name: string;
  singular: string;
  plural: string;
  symbol: string;
}

export interface LanguageDetails {
  name: string;
  nativeName: string | null;
}

export interface Country {
  name: {
    common: string;
    official: string;
    commonArticle: string | null;
    officialArticle: string | null;
  };
  topLevelDomain: string | null;
  currency: string | null;
  phone: string | null;
  languages: {
    code: string;
    percentage: number | null;
    status: string | null; // Use this to decide “official”
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
  scheduled_service: string; // 'yes' | 'no'
  icao_code: string | null;
  iata_code: string | null;
  gps_code: string | null;
  local_code: string | null;
}

export interface AirportIndexItem {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  id: string;
}

export interface Config {
  nearbyAirports?: number; // keep, but you may add a richer options object for resolveVisitorContext
}

export interface VisitorContext extends GeoInfo {
  country: Country | null;
  region: Region | null;
  airports: Airport[] | null;
}
