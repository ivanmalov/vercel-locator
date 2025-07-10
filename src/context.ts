import { parseGeo, GeoInfo } from './parse';
import { countries, Country } from './generated/countries';
import { regions, Region } from './generated/regions';

export interface Config {
    //user expandable
}

export interface VisitorContext extends GeoInfo {
  ip: string | null;
  country: Country | null;
  region: Region | null;
  //headers: Record<string, string | undefined>;
}

export function resolveVisitorContext(
  input: Request | Headers,
  opts: Partial<Config> = {},
): VisitorContext {
  const headers = input instanceof Request ? input.headers : input;
  const geo = parseGeo(headers);

  const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');

  // Assemble once and return
  return {
    ip: headers.get('x-real-ip') ?? null,
    country: countries[geo.countryCode ?? ''] ?? null,
    region: regionKey ? regions[regionKey] ?? null : null,
    //headers: Object.fromEntries(headers),
    ...geo
  };
}
