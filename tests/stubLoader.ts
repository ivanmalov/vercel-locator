import RBush from 'rbush';
import type { DataLoader } from '../src/data/loader';
import type { Country, Region, CurrencyDetails, LanguageDetails, Airport, AirportIndexItem } from '../src/interfaces';

export class StubLoader implements DataLoader {
  constructor(
    private opts: {
      countries?: Record<string, Country>;
      regions?: Record<string, Region>;
      currencies?: Record<string, CurrencyDetails>;
      languages?: Record<string, LanguageDetails>;
      airports?: Record<string, Airport>;
      indexItems?: AirportIndexItem[];
      icaoMap?: Record<string, string>;
      iataMap?: Record<string, string>;
    } = {}
  ) {}

  async loadCountries() {
    return this.opts.countries ?? {};
  }
  async loadRegions() {
    return this.opts.regions ?? {};
  }
  async loadCurrencies() {
    return this.opts.currencies ?? {};
  }
  async loadLanguages() {
    return this.opts.languages ?? {};
  }
  async loadAirports() {
    const airports = this.opts.airports ?? {};
    const index = new RBush<AirportIndexItem>();
    if (this.opts.indexItems) index.load(this.opts.indexItems);
    const icaoMap = this.opts.icaoMap ?? {};
    const iataMap = this.opts.iataMap ?? {};
    return { airports, airportIndex: index, icaoMap, iataMap };
  }
}
