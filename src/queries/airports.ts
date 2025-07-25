import knn from 'rbush-knn';
import type { DataLoader } from '../data/loader';
import type { Airport } from '../interfaces';
import type { Predicate } from '../utils/predicates';

export interface AirportOptions {
  count?: number;
  filter?: Predicate<Airport>;
}

export const hasRegularService: Predicate<Airport> = a => a.scheduled_service === 'yes';

export async function lookupAirportsByCoords(
  loader: DataLoader,
  lat: number,
  lon: number,
  opts: AirportOptions = {}
): Promise<Airport[]> {
  const { airports, airportIndex } = await loader.loadAirports();
  const searchCount = opts.filter ? Math.max(opts.count ?? 10, 500) : (opts.count ?? 10);
  const nearest = knn(airportIndex as any, lon, lat, searchCount);

  const filter = opts.filter ?? (() => true);
  const out: Airport[] = [];
  for (const item of nearest) {
    const a = airports[item.id];
    if (a && filter(a)) {
      out.push(a);
      if (out.length >= (opts.count ?? 10)) break;
    }
  }
  return out;
}

export async function lookupAirportByIcao(loader: DataLoader, code: string): Promise<Airport | null> {
  const { airports, icaoMap } = await loader.loadAirports();
  const id = icaoMap[code.toUpperCase()];
  return id ? airports[id] ?? null : null;
}

export async function lookupAirportByIata(loader: DataLoader, code: string): Promise<Airport | null> {
  const { airports, iataMap } = await loader.loadAirports();
  const id = iataMap[code.toUpperCase()];
  return id ? airports[id] ?? null : null;
}
