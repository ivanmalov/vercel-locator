"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGeo = parseGeo;
function parseGeo(headers) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        continentCode: (_a = headers.get('x-vercel-ip-continent')) !== null && _a !== void 0 ? _a : null,
        countryCode: (_b = headers.get('x-vercel-ip-country')) !== null && _b !== void 0 ? _b : null,
        regionCode: (_c = headers.get('x-vercel-ip-country-region')) !== null && _c !== void 0 ? _c : null,
        city: (_d = headers.get('x-vercel-ip-city')) !== null && _d !== void 0 ? _d : null,
        postalCode: (_e = headers.get('x-vercel-ip-postal-code')) !== null && _e !== void 0 ? _e : null,
        longitude: parseFloat((_f = headers.get('x-vercel-ip-longitude')) !== null && _f !== void 0 ? _f : 'NaN'),
        latitude: parseFloat((_g = headers.get('x-vercel-ip-latitude')) !== null && _g !== void 0 ? _g : 'NaN'),
        timezone: (_h = headers.get('x-vercel-ip-timezone')) !== null && _h !== void 0 ? _h : null,
    };
}
