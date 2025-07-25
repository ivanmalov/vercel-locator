import type { DataLoader } from '../data/loader.js';
import type { LanguageDetails, Country } from '../interfaces.js';
export declare function lookupLanguage(loader: DataLoader, code: string): Promise<LanguageDetails | null>;
export interface CountryLanguageFilter {
    officialOnly?: boolean;
    minPercentage?: number;
    predicate?: (entry: Country['languages'][number]) => boolean;
}
export declare function listCountryLanguages(loader: DataLoader, countryCode: string, filter?: CountryLanguageFilter): Promise<{
    code: string;
    percentage: number | null;
    status: string | null;
}[]>;
