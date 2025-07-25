import type { DataLoader } from '../data/loader';
import type { Country } from '../interfaces';
export declare function lookupCountry(loader: DataLoader, code: string): Promise<Country | null>;
