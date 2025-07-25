import type { DataLoader } from '../data/loader';
import type { CurrencyDetails } from '../interfaces';

export async function lookupCurrency(loader: DataLoader, code: string): Promise<CurrencyDetails | null> {
  const currencies = await loader.loadCurrencies();
  return currencies[code.toUpperCase()] ?? null;
}
