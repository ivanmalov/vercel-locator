"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisitorContext = resolveVisitorContext;
const parse_1 = require("./parse");
const countries_1 = require("./generated/countries");
function resolveVisitorContext(input, opts = {}) {
    const headers = input instanceof Request ? input.headers : input;
    const geo = (0, parse_1.parseGeo)(headers);
    // Assemble once and return
    return {
        ip: headers.get('x-real-ip') ?? null,
        country: countries_1.countries[geo.countryCode ?? ''] ?? null,
        //headers: Object.fromEntries(headers),
        ...geo
    };
}
