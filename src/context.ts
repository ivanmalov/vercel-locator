import { parseGeo, GeoInfo } from './parse';
import { countries, Country } from './generated/countries';
export interface Config {
    //user expandable
}

export interface VisitorContext extends GeoInfo {
  ip: string | null;
  country: Country | null;
  //headers: Record<string, string | undefined>;
}

export function resolveVisitorContext(
  input: Request | Headers,
  opts: Partial<Config> = {},
): VisitorContext {
  const headers = input instanceof Request ? input.headers : input;
  const geo = parseGeo(headers);

  // Assemble once and return
  return {
    ip: headers.get('x-real-ip') ?? null,
    country: countries[geo.countryCode ?? ''] ?? null,
    //headers: Object.fromEntries(headers),
    ...geo
  };
}
