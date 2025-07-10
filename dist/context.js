"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisitorContext = resolveVisitorContext;
const parse_1 = require("./parse");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// --- Create a cache for data ---
let countries;
let regions;
let airports;
let airportIndex;
// --- Create a promise that resolves once all data is loaded at startup ---
const initializationPromise = (async () => {
    try {
        const { default: RBush } = await import('rbush');
        // Read all data files when the module first loads
        const countriesData = fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/countries.json'), 'utf-8');
        const regionsData = fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/regions.json'), 'utf-8');
        const airportsData = fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/airports/airports.json'), 'utf-8');
        const airportIndexData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/airports/index.json'), 'utf-8'));
        // Parse the data and build the index
        countries = JSON.parse(countriesData);
        regions = JSON.parse(regionsData);
        airports = JSON.parse(airportsData);
        airportIndex = new RBush().fromJSON(airportIndexData);
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
    const geo = (0, parse_1.parseGeo)(headers);
    const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');
    let nearbyAirports = null;
    if (geo.latitude && geo.longitude) {
        const { default: knn } = await import('rbush-knn');
        // The non-null assertion `!` is safe because initializationPromise ensures these are loaded.
        const nearest = knn(airportIndex, geo.longitude, geo.latitude, opts.nearbyAirports ?? 10);
        nearbyAirports = nearest.map(item => airports[item.id]);
    }
    // Assemble once and return
    return {
        // ip is now included in the ...geo spread
        country: countries[geo.countryCode ?? ''] ?? null,
        region: regionKey ? regions[regionKey] ?? null : null,
        airports: nearbyAirports,
        //headers: Object.fromEntries(headers),
        ...geo
    };
}
