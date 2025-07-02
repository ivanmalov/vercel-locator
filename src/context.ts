import { parseGeo, GeoInfo } from './parse'

export interface Config {
    //user expandable
}

export interface VisitorContext extends GeoInfo {
  ip: string | null;
  headers: Record<string, string | undefined>;
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
    headers: Object.fromEntries(headers),
    ...geo
  };
}
