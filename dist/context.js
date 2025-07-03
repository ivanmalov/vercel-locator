"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisitorContext = resolveVisitorContext;
const parse_1 = require("./parse");
const currency_1 = require("geoinfo/currency");
function resolveVisitorContext(input, opts = {}) {
    var _a, _b, _c;
    const headers = input instanceof Request ? input.headers : input;
    const geo = (0, parse_1.parseGeo)(headers);
    // Assemble once and return
    return Object.assign({ ip: (_a = headers.get('x-real-ip')) !== null && _a !== void 0 ? _a : null, currency: (_c = currency_1.currency[(_b = geo.countryCode) !== null && _b !== void 0 ? _b : '']) !== null && _c !== void 0 ? _c : null }, geo);
}
