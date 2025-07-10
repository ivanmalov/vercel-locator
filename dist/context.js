"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisitorContext = resolveVisitorContext;
const parse_1 = require("./parse");
const countries_1 = require("./generated/countries");
const regions_1 = require("./generated/regions");
function resolveVisitorContext(input, opts = {}) {
    const headers = input instanceof Request ? input.headers : input;
    const geo = (0, parse_1.parseGeo)(headers);
    const regionKey = (geo.countryCode ?? '') + (geo.regionCode ?? '');
    // Assemble once and return
    return {
        ip: headers.get('x-real-ip') ?? null,
        country: countries_1.countries[geo.countryCode ?? ''] ?? null,
        region: regionKey ? regions_1.regions[regionKey] ?? null : null,
        //headers: Object.fromEntries(headers),
        ...geo
    };
}
