import type RBush from 'rbush';
import type { DataLoader } from './loader.js';
import type { Country, Region, CurrencyDetails, LanguageDetails, Airport, AirportIndexItem } from '../interfaces.js';
export declare class FSLoader implements DataLoader {
    private baseDir;
    constructor(baseDir: string);
    private readJSON;
    loadCountries(): Promise<Record<string, Country>>;
    loadRegions(): Promise<Record<string, Region>>;
    loadCurrencies(): Promise<Record<string, CurrencyDetails>>;
    loadLanguages(): Promise<Record<string, LanguageDetails>>;
    loadAirports(): Promise<{
        airports: Record<string, Airport>;
        airportIndex: RBush<AirportIndexItem>;
        icaoMap: Record<string, string>;
        iataMap: Record<string, string>;
    }>;
}
