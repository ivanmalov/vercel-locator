"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisitorContext = resolveVisitorContext;
const parse_1 = require("./parse");
const flatbush_1 = __importDefault(require("flatbush"));
// Import data directly so it's included in the bundle
const countries_json_1 = __importDefault(require("./generated/countries.json"));
const regions_json_1 = __importDefault(require("./generated/regions.json"));
const airports_json_1 = __importDefault(require("./generated/airports/airports.json"));
const index_1 = require("./generated/airports/index");
const index_ids_json_1 = __importDefault(require("./generated/airports/index-ids.json"));
// Helper function to decode base64 to ArrayBuffer for the edge runtime
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
const countries = countries_json_1.default;
const regions = regions_json_1.default;
const airports = airports_json_1.default;
const indexIds = index_ids_json_1.default;
const airportIndexBuffer = base64ToArrayBuffer(index_1.data);
const airportIndex = flatbush_1.default.from(airportIndexBuffer);
function resolveVisitorContext(input, opts = {}) {
    const headers = input instanceof Request ? input.headers : input;
    const geo = (0, parse_1.parseGeo)(headers);
    const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');
    let nearbyAirports = null;
    if (geo.latitude && geo.longitude) {
        const nearestIndices = airportIndex.neighbors(geo.longitude, geo.latitude, opts.nearbyAirports ?? 10);
        nearbyAirports = nearestIndices.map(index => airports[indexIds[index]]);
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
