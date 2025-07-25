import type { DataLoader } from './loader';
import type { Country, Region, CurrencyDetails, LanguageDetails, Airport, AirportIndexItem } from '../interfaces';
import type RBush from 'rbush';
export declare class MemoryCacheLoader implements DataLoader {
    private loader;
    constructor(loader: DataLoader);
    private countries?;
    private regions?;
    private currencies?;
    private languages?;
    private airports?;
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
