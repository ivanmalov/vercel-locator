import type { DataLoader } from '../data/loader.js';
import type { CurrencyDetails } from '../interfaces.js';

export async function lookupCurrency(loader: DataLoader, code: string): Promise<CurrencyDetails | null> {
  const currencies = await loader.loadCurrencies();
  return currencies[code.toUpperCase()] ?? null;
}
