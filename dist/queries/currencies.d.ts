import type { DataLoader } from '../data/loader.js';
import type { CurrencyDetails } from '../interfaces.js';
export declare function lookupCurrency(loader: DataLoader, code: string): Promise<CurrencyDetails | null>;
