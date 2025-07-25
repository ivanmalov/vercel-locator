export class MemoryCacheLoader {
    loader;
    constructor(loader) {
        this.loader = loader;
    }
    countries;
    regions;
    currencies;
    languages;
    airports;
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
