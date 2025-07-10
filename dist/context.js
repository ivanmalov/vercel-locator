"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisitorContext = resolveVisitorContext;
const parse_1 = require("./parse");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rbush_1 = __importDefault(require("rbush"));
const rbush_knn_1 = __importDefault(require("rbush-knn"));
const countries = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/countries.json'), 'utf-8'));
const regions = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/regions.json'), 'utf-8'));
const airports = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/airports/airports.json'), 'utf-8'));
const airportIndexData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, 'generated/airports/index.json'), 'utf-8'));
const airportIndex = new rbush_1.default().fromJSON(airportIndexData);
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
