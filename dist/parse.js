"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGeo = parseGeo;
function parseGeo(headers) {
    var _a, _b, _c, _d;
    return {
        countryCode: (_a = headers.get('x-vercel-ip-country')) !== null && _a !== void 0 ? _a : null,
        countryName: null, // we’ll fill this in later when we add a map
        regionCode: (_b = headers.get('x-vercel-ip-country-region')) !== null && _b !== void 0 ? _b : null,
        city: (_c = headers.get('x-vercel-ip-city')) !== null && _c !== void 0 ? _c : null,
        postalCode: (_d = headers.get('x-vercel-ip-postal-code')) !== null && _d !== void 0 ? _d : null,
    };
}
