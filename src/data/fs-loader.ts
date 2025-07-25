import fs from 'fs/promises';
import path from 'path';
import type RBush from 'rbush';
import { DataLoadError } from './errors';
import type { DataLoader } from './loader';
import type { Country, Region, CurrencyDetails, LanguageDetails, Airport, AirportIndexItem } from '../interfaces';

export class FSLoader implements DataLoader {
  constructor(private baseDir: string) {}

  async loadCountries(): Promise<Record<string, Country>> {
    try {
      const data = await fs.readFile(path.join(this.baseDir, 'countries.json'), 'utf8');
      return JSON.parse(data);
    } catch (err) {
      throw new DataLoadError('Failed to load countries', err);
    }
  }

  async loadRegions(): Promise<Record<string, Region>> {
    try {
      const data = await fs.readFile(path.join(this.baseDir, 'regions.json'), 'utf8');
      return JSON.parse(data);
    } catch (err) {
      throw new DataLoadError('Failed to load regions', err);
    }
  }

  async loadCurrencies(): Promise<Record<string, CurrencyDetails>> {
    try {
      const data = await fs.readFile(path.join(this.baseDir, 'currencies.json'), 'utf8');
      return JSON.parse(data);
    } catch (err) {
      throw new DataLoadError('Failed to load currencies', err);
    }
  }

  async loadLanguages(): Promise<Record<string, LanguageDetails>> {
    try {
      const data = await fs.readFile(path.join(this.baseDir, 'languages.json'), 'utf8');
      return JSON.parse(data);
    } catch (err) {
      throw new DataLoadError('Failed to load languages', err);
    }
  }

  async loadAirports(): Promise<{
    airports: Record<string, Airport>;
    airportIndex: RBush<AirportIndexItem>;
    icaoMap: Record<string, string>;
    iataMap: Record<string, string>;
  }> {
    try {
      const [{ default: RBush }, _knn] = await Promise.all([
        import('rbush'),
        import('rbush-knn'),
      ]);
      const [airportsData, indexData, icaoData, iataData] = await Promise.all([
        fs.readFile(path.join(this.baseDir, 'airports/airports.json'), 'utf8'),
        fs.readFile(path.join(this.baseDir, 'airports/index.json'), 'utf8'),
        fs.readFile(path.join(this.baseDir, 'airports/icao-map.json'), 'utf8'),
        fs.readFile(path.join(this.baseDir, 'airports/iata-map.json'), 'utf8'),
      ]);
      const airports: Record<string, Airport> = JSON.parse(airportsData);
      const airportIndex = new RBush<AirportIndexItem>().fromJSON(JSON.parse(indexData));
      const icaoMap: Record<string, string> = JSON.parse(icaoData);
      const iataMap: Record<string, string> = JSON.parse(iataData);
      return { airports, airportIndex, icaoMap, iataMap };
    } catch (err) {
      throw new DataLoadError('Failed to load airports', err);
    }
  }
}
