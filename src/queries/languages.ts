import type { DataLoader } from '../data/loader.js';
import type { LanguageDetails, Country } from '../interfaces.js';

export async function lookupLanguage(loader: DataLoader, code: string): Promise<LanguageDetails | null> {
  const languages = await loader.loadLanguages();
  return languages[code] ?? null;
}

export interface CountryLanguageFilter {
  officialOnly?: boolean;
  minPercentage?: number;
  predicate?: (entry: Country['languages'][number]) => boolean;
}

export async function listCountryLanguages(
  loader: DataLoader,
  countryCode: string,
  filter: CountryLanguageFilter = {}
) {
  const countries = await loader.loadCountries();
  const country = countries[countryCode.toUpperCase()];
  if (!country) return [];

  let list = country.languages;
  if (filter.officialOnly) {
    list = list.filter(l => (l.status ?? '').toLowerCase() === 'official');
  }
  if (filter.minPercentage != null) {
    list = list.filter(l => (l.percentage ?? 0) >= filter.minPercentage!);
  }
  if (filter.predicate) {
    list = list.filter(filter.predicate);
  }

  return list;
}
