import { parseGeo } from '../parse/parseGeo.js';
import type { DataLoader } from '../data/loader.js';
import type { VisitorContext, Config, Airport } from '../interfaces.js';
import { lookupAirportsByCoords, hasRegularService } from '../queries/airports.js';

export interface IncludeOptions {
  airports?: boolean | { count?: number; regularServiceOnly?: boolean };
  region?: boolean;
}

export interface CreateLocatorOptions extends Partial<Config> {
  include?: IncludeOptions;
}

export function createLocator(loader: DataLoader, defaults: CreateLocatorOptions = {}) {
  return async function resolveVisitorContext(
    input: Request | Headers | Record<string, string | string[] | undefined>,
    opts: CreateLocatorOptions = {}
  ): Promise<VisitorContext> {
    const merged = { ...defaults, ...opts };
    const headers = input instanceof Request ? input.headers : input;
    const geo = parseGeo(headers);

    const [countries, regions] = await Promise.all([
      loader.loadCountries(),
      loader.loadRegions(),
    ]);

    const country = geo.countryCode ? countries[geo.countryCode] ?? null : null;

    const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');
    const region = merged.include?.region === false ? null : (regions[regionKey] ?? null);

    let airports: Airport[] | null = null;
    if (merged.include?.airports && geo.latitude && geo.longitude) {
      const airportOpts = typeof merged.include.airports === 'object' ? merged.include.airports : {};
      const predicate = airportOpts.regularServiceOnly ? hasRegularService : undefined;
      airports = await lookupAirportsByCoords(loader, geo.latitude, geo.longitude, {
        count: airportOpts.count ?? (merged.nearbyAirports ?? 10),
        filter: predicate,
      });
    }

    return { ...geo, country, region, airports };
  };
}
