import type { DataLoader } from '../data/loader';
import type { Country } from '../interfaces';

export async function lookupCountry(loader: DataLoader, code: string): Promise<Country | null> {
  const countries = await loader.loadCountries();
  return countries[code.toUpperCase()] ?? null;
}
