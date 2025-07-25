import type { DataLoader } from '../data/loader';
import type { CurrencyDetails } from '../interfaces';
export declare function lookupCurrency(loader: DataLoader, code: string): Promise<CurrencyDetails | null>;
