import type { DataLoader } from '../data/loader';
import type { Airport } from '../interfaces';
import type { Predicate } from '../utils/predicates';
export interface AirportOptions {
    count?: number;
    filter?: Predicate<Airport>;
}
export declare const hasRegularService: Predicate<Airport>;
export declare function lookupAirportsByCoords(loader: DataLoader, lat: number, lon: number, opts?: AirportOptions): Promise<Airport[]>;
export declare function lookupAirportByIcao(loader: DataLoader, code: string): Promise<Airport | null>;
export declare function lookupAirportByIata(loader: DataLoader, code: string): Promise<Airport | null>;
