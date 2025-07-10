"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisitorContext = resolveVisitorContext;
const parse_1 = require("./parse");
const rbush_1 = __importDefault(require("rbush"));
const rbush_knn_1 = __importDefault(require("rbush-knn"));
// Import data directly so it's included in the bundle
const countries_json_1 = __importDefault(require("./generated/countries.json"));
const regions_json_1 = __importDefault(require("./generated/regions.json"));
const airports_json_1 = __importDefault(require("./generated/airports/airports.json"));
const index_json_1 = __importDefault(require("./generated/airports/index.json"));
const countries = countries_json_1.default;
const regions = regions_json_1.default;
const airports = airports_json_1.default;
const airportIndex = new rbush_1.default().fromJSON(index_json_1.default);
function resolveVisitorContext(input, opts = {}) {
    const headers = input instanceof Request ? input.headers : input;
    const geo = (0, parse_1.parseGeo)(headers);
    const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');
    let nearbyAirports = null;
    if (geo.latitude && geo.longitude) {
        const nearest = (0, rbush_knn_1.default)(airportIndex, geo.longitude, geo.latitude, opts.nearbyAirports ?? 10);
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
