"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisitorContext = resolveVisitorContext;
exports.lookupCountry = lookupCountry;
exports.lookupRegion = lookupRegion;
exports.lookupCurrency = lookupCurrency;
exports.lookupLanguage = lookupLanguage;
exports.lookupAirportsByCoords = lookupAirportsByCoords;
exports.lookupAirportByIcao = lookupAirportByIcao;
exports.lookupAirportByIata = lookupAirportByIata;
const parse_js_1 = require("./parse.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// --- Create a cache for data ---
let countries;
let regions;
let currencies;
let languages;
let airports;
let airportIndex;
let icaoMap;
let iataMap;
// --- Create a promise that resolves once all data is loaded at startup ---
const initializationPromise = (async () => {
    try {
        const { default: RBush } = await import('rbush');
        // Read all data files when the module first loads
        const countriesData = fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/countries.json'), 'utf-8');
        const regionsData = fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/regions.json'), 'utf-8');
        const currenciesData = fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/currencies.json'), 'utf-8');
        const languagesData = fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/languages.json'), 'utf-8');
        const airportsData = fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/airports/airports.json'), 'utf-8');
        const airportIndexData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/airports/index.json'), 'utf-8'));
        const icaoMapData = fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/airports/icao-map.json'), 'utf-8');
        const iataMapData = fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/airports/iata-map.json'), 'utf-8');
        // Parse the data and build the index
        countries = JSON.parse(countriesData);
        regions = JSON.parse(regionsData);
        currencies = JSON.parse(currenciesData);
        languages = JSON.parse(languagesData);
        airports = JSON.parse(airportsData);
        airportIndex = new RBush().fromJSON(airportIndexData);
        icaoMap = JSON.parse(icaoMapData);
        iataMap = JSON.parse(iataMapData);
        console.log('Locator data initialized successfully.');
    }
    catch (err) {
        console.error('Failed to initialize locator data:', err);
        process.exit(1); // Exit if data loading fails, as the app can't function
    }
})();
// The function must be async to support dynamic imports
async function resolveVisitorContext(input, opts = {}) {
    // Wait for the one-time data load to complete.
    // On subsequent calls, this promise will already be resolved and this will be instant.
    await initializationPromise;
    const headers = input instanceof Request ? input.headers : input;
    const geo = (0, parse_js_1.parseGeo)(headers);
    const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');
    let nearbyAirports = null;
    if (geo.latitude && geo.longitude) {
        const { default: knn } = await import('rbush-knn');
        // The non-null assertion `!` is safe because initializationPromise ensures these are loaded.
        const nearest = knn(airportIndex, geo.longitude, geo.latitude, opts.nearbyAirports ?? 10);
        // --- DIAGNOSTIC LOG ---
        // This loop will check each ID found by the search and log a warning if it's missing from the main data file.
        nearest.forEach(item => {
            if (!airports[item.id]) {
                console.warn(`[vercel-locator] Data integrity issue: Airport ID "${item.id}" was found in the spatial index but is missing from the main airport data file.`);
            }
        });
        // Map to airport objects and then filter out any that were not found.
        // This prevents `undefined` values in the final array.
        nearbyAirports = nearest
            .map(item => airports[item.id])
            .filter((airport) => airport !== undefined);
    }
    // --- minimal enrichment: clone & add language names to the country object ---
    const rawCountry = countries[geo.countryCode ?? ''] ?? null;
    const country = rawCountry
        ? {
            ...rawCountry,
            languages: rawCountry.languages.map(l => ({
                ...l,
                name: languages[l.code]?.name ?? null,
                nativeName: languages[l.code]?.nativeName ?? null,
            })),
        }
        : null;
    // Assemble once and return
    return {
        // ip is now included in the ...geo spread
        country,
        region: regionKey ? regions[regionKey] ?? null : null,
        airports: nearbyAirports,
        //headers: Object.fromEntries(headers),
        ...geo,
    };
}
// --- Direct Lookup Functions ---
/**
 * Looks up a country by its ISO 3166-1 alpha-2 code.
 * @param code The two-letter country code (e.g., "US").
 * @returns A Country object or null if not found.
 */
async function lookupCountry(code) {
    await initializationPromise;
    return countries[code.toUpperCase()] ?? null;
}
/**
 * Looks up a region by its ISO 3166-2 code.
 * @param code The region code (e.g., "US-CA").
 * @returns A Region object or null if not found.
 */
async function lookupRegion(code) {
    await initializationPromise;
    return regions[code.toUpperCase()] ?? null;
}
/**
 * Looks up currency details by its ISO 4217 code.
 * @param code The three-letter currency code (e.g., "USD").
 * @returns A CurrencyDetails object or null if not found.
 */
async function lookupCurrency(code) {
    await initializationPromise;
    return currencies[code.toUpperCase()] ?? null;
}
/**
 * Looks up language details by its code.
 * @param code The language code (e.g., "en", "az_Cyrl").
 * @returns A LanguageDetails object or null if not found.
 */
async function lookupLanguage(code) {
    await initializationPromise;
    return languages[code] ?? null;
}
/**
 * Finds the nearest airport(s) to a given set of coordinates, with an optional filter.
 * @param lat The latitude.
 * @param lon The longitude.
 * @param count The number of airports to return. Defaults to 10.
 * @param filter An optional function to filter the results.
 * @returns An array of Airport objects.
 */
async function lookupAirportsByCoords(lat, lon, count = 1, filter) {
    await initializationPromise;
    const { default: knn } = await import('rbush-knn');
    // If a filter is provided, we search for more initial candidates (e.g., 50)
    // to ensure we find enough that match the filter criteria.
    const searchCount = filter ? 100000 : count;
    const nearest = knn(airportIndex, lon, lat, searchCount);
    let candidates = nearest
        .map(item => airports[item.id])
        .filter((airport) => airport !== undefined);
    // Apply the user-provided filter if it exists
    if (filter) {
        candidates = candidates.filter(filter);
    }
    // Finally, return the requested number of airports
    return candidates.slice(0, count);
}
/**
 * Looks up an airport by its ICAO code.
 * @param code The 4-letter ICAO code (e.g., "KLAX").
 * @returns An Airport object or null if not found.
 */
async function lookupAirportByIcao(code) {
    await initializationPromise;
    const airportId = icaoMap[code.toUpperCase()];
    return airportId ? (airports[airportId] ?? null) : null;
}
/**
 * Looks up an airport by its IATA code.
 * @param code The 3-letter IATA code (e.g., "LAX").
 * @returns An Airport object or null if not found.
 */
async function lookupAirportByIata(code) {
    await initializationPromise;
    const airportId = iataMap[code.toUpperCase()];
    return airportId ? (airports[airportId] ?? null) : null;
}
