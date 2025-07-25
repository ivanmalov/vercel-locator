import fs from 'fs/promises';
import path from 'path';
import type RBush from 'rbush';
import type { DataLoader } from './loader';
import type { Country, Region, CurrencyDetails, LanguageDetails, Airport, AirportIndexItem } from '../interfaces';
import { DataLoadError } from './errors';

export class FSLoader implements DataLoader {
  constructor(private baseDir: string) {}

  private async readJSON<T>(file: string): Promise<T> {
    try {
      const data = await fs.readFile(path.join(this.baseDir, file), 'utf-8');
      return JSON.parse(data) as T;
    } catch (err) {
      throw new DataLoadError(`Failed to load ${file}`, err);
    }
  }

  loadCountries(): Promise<Record<string, Country>> {
    return this.readJSON('countries.json');
  }

  loadRegions(): Promise<Record<string, Region>> {
    return this.readJSON('regions.json');
  }

  loadCurrencies(): Promise<Record<string, CurrencyDetails>> {
    return this.readJSON('currencies.json');
  }

  loadLanguages(): Promise<Record<string, LanguageDetails>> {
    return this.readJSON('languages.json');
  }

  async loadAirports(): Promise<{
    airports: Record<string, Airport>;
    airportIndex: RBush<AirportIndexItem>;
    icaoMap: Record<string, string>;
    iataMap: Record<string, string>;
  }> {
    const { default: RBush } = await import('rbush');
    try {
      const airports = await this.readJSON<Record<string, Airport>>('airports/airports.json');
      const indexJson = await this.readJSON<any>('airports/index.json');
      const icaoMap = await this.readJSON<Record<string, string>>('airports/icao-map.json');
      const iataMap = await this.readJSON<Record<string, string>>('airports/iata-map.json');

      const airportIndex = new RBush<AirportIndexItem>().fromJSON(indexJson);

      return { airports, airportIndex, icaoMap, iataMap };
    } catch (err) {
      throw new DataLoadError('Failed to load airports', err);
    }
  }
}
