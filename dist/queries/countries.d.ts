import type { DataLoader } from '../data/loader.js';
import type { Country } from '../interfaces.js';
export declare function lookupCountry(loader: DataLoader, code: string): Promise<Country | null>;
