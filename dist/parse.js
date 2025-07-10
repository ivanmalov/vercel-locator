"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGeo = parseGeo;
function parseGeo(headers) {
    // Helper to get a header value regardless of input type.
    // Plain objects in Node.js typically have lowercase keys.
    const getHeader = (key) => {
        if (headers instanceof Headers) {
            return headers.get(key);
        }
        return headers[key.toLowerCase()] ?? null;
    };
    return {
        continentCode: getHeader('x-vercel-ip-continent'),
        countryCode: getHeader('x-vercel-ip-country'),
        regionCode: getHeader('x-vercel-ip-country-region'),
        city: getHeader('x-vercel-ip-city'),
        postalCode: getHeader('x-vercel-ip-postal-code'),
        longitude: parseFloat(getHeader('x-vercel-ip-longitude') ?? 'NaN'),
        latitude: parseFloat(getHeader('x-vercel-ip-latitude') ?? 'NaN'),
        timezone: getHeader('x-vercel-ip-timezone'),
    };
}
