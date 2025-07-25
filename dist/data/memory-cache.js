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
