import fs from 'fs/promises';
import path from 'path';
import { DataLoadError } from './errors.js';
export class FSLoader {
    baseDir;
    constructor(baseDir) {
        this.baseDir = baseDir;
    }
    async readJSON(file) {
        try {
            const data = await fs.readFile(path.join(this.baseDir, file), 'utf-8');
            return JSON.parse(data);
        }
        catch (err) {
            throw new DataLoadError(`Failed to load ${file}`, err);
        }
    }
    loadCountries() {
        return this.readJSON('countries.json');
    }
    loadRegions() {
        return this.readJSON('regions.json');
    }
    loadCurrencies() {
        return this.readJSON('currencies.json');
    }
    loadLanguages() {
        return this.readJSON('languages.json');
    }
    async loadAirports() {
        const { default: RBush } = await import('rbush');
        try {
            const airports = await this.readJSON('airports/airports.json');
            const indexJson = await this.readJSON('airports/index.json');
            const icaoMap = await this.readJSON('airports/icao-map.json');
            const iataMap = await this.readJSON('airports/iata-map.json');
            const airportIndex = new RBush().fromJSON(indexJson);
            return { airports, airportIndex, icaoMap, iataMap };
        }
        catch (err) {
            throw new DataLoadError('Failed to load airports', err);
        }
    }
}
