"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisitorContext = resolveVisitorContext;
const parse_1 = require("./parse");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// --- Create a cache for data to avoid reading files on every request ---
let countries = null;
let regions = null;
let airports = null;
let airportIndex = null; // This will hold the RBush instance
// The function must be async to support dynamic imports
async function resolveVisitorContext(input, opts = {}) {
    // Lazy-load data and modules only on the first invocation
    if (!airportIndex) {
        const { default: RBush } = await import('rbush');
        countries = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/countries.json'), 'utf-8'));
        regions = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/regions.json'), 'utf-8'));
        airports = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/airports/airports.json'), 'utf-8'));
        const airportIndexData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/airports/index.json'), 'utf-8'));
        airportIndex = new RBush().fromJSON(airportIndexData);
    }
    const headers = input instanceof Request ? input.headers : input;
    const geo = (0, parse_1.parseGeo)(headers);
    const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');
    let nearbyAirports = null;
    if (geo.latitude && geo.longitude) {
        const { default: knn } = await import('rbush-knn');
        const nearest = knn(airportIndex, geo.longitude, geo.latitude, opts.nearbyAirports ?? 10);
        nearbyAirports = nearest.map(item => airports[item.id]);
    }
    // Assemble once and return
    return {
        ip: headers.get('x-real-ip') ?? null,
        country: countries[geo.countryCode ?? ''] ?? null,
        region: regionKey ? regions[regionKey] ?? null : null,
        airports: nearbyAirports,
        //headers: Object.fromEntries(headers),
        ...geo
    };
}
