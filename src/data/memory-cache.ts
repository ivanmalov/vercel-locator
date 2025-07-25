import type { DataLoader } from './loader';
import type {
  Country,
  Region,
  CurrencyDetails,
  LanguageDetails,
  Airport,
  AirportIndexItem
} from '../interfaces';
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
    return this.countries ??= this.loader.loadCountries();
  }

  loadRegions() {
    return this.regions ??= this.loader.loadRegions();
  }

  loadCurrencies() {
    return this.currencies ??= this.loader.loadCurrencies();
  }

  loadLanguages() {
    return this.languages ??= this.loader.loadLanguages();
  }

  loadAirports() {
    return this.airports ??= this.loader.loadAirports();
  }
}
