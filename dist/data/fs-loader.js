import fs from 'fs/promises';
import path from 'path';
import { DataLoadError } from './errors';
export class FSLoader {
    baseDir;
    constructor(baseDir) {
        this.baseDir = baseDir;
    }
    async loadCountries() {
        try {
            const data = await fs.readFile(path.join(this.baseDir, 'countries.json'), 'utf8');
            return JSON.parse(data);
        }
        catch (err) {
            throw new DataLoadError('Failed to load countries', err);
        }
    }
    async loadRegions() {
        try {
            const data = await fs.readFile(path.join(this.baseDir, 'regions.json'), 'utf8');
            return JSON.parse(data);
        }
        catch (err) {
            throw new DataLoadError('Failed to load regions', err);
        }
    }
    async loadCurrencies() {
        try {
            const data = await fs.readFile(path.join(this.baseDir, 'currencies.json'), 'utf8');
            return JSON.parse(data);
        }
        catch (err) {
            throw new DataLoadError('Failed to load currencies', err);
        }
    }
    async loadLanguages() {
        try {
            const data = await fs.readFile(path.join(this.baseDir, 'languages.json'), 'utf8');
            return JSON.parse(data);
        }
        catch (err) {
            throw new DataLoadError('Failed to load languages', err);
        }
    }
    async loadAirports() {
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
            const airports = JSON.parse(airportsData);
            const airportIndex = new RBush().fromJSON(JSON.parse(indexData));
            const icaoMap = JSON.parse(icaoData);
            const iataMap = JSON.parse(iataData);
            return { airports, airportIndex, icaoMap, iataMap };
        }
        catch (err) {
            throw new DataLoadError('Failed to load airports', err);
        }
    }
}
