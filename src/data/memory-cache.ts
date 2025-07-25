import type { DataLoader } from './loader.js';
import type { Country, Region, CurrencyDetails, LanguageDetails, Airport, AirportIndexItem } from '../interfaces.js';
import type RBush from 'rbush';

export class MemoryCacheLoader implements DataLoader {
  constructor(private loader: DataLoader) {}

  private countries?: Promise<Record<string, Country>>;
  private regions?: Promise<Record<string, Region>>;
  private currencies?: Promise<Record<string, CurrencyDetails>>;
  private languages?: Promise<Record<string, LanguageDetails>>;
  private airports?: Promise<{
    airports: Record<string, Airport>;
    airportIndex: RBush<AirportIndexItem>;
    icaoMap: Record<string, string>;
    iataMap: Record<string, string>;
  }>;

  loadCountries() {
    this.countries ||= this.loader.loadCountries();
    return this.countries;
  }

  loadRegions() {
    this.regions ||= this.loader.loadRegions();
    return this.regions;
  }

  loadCurrencies() {
    this.currencies ||= this.loader.loadCurrencies();
    return this.currencies;
  }

  loadLanguages() {
    this.languages ||= this.loader.loadLanguages();
    return this.languages;
  }

  loadAirports() {
    this.airports ||= this.loader.loadAirports();
    return this.airports;
  }
}
