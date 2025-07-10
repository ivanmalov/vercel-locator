export interface GeoInfo {
  ip: string | null;
  continentCode: string | null;  
  countryCode: string | null;
  regionCode: string | null;
  city: string | null;
  postalCode: string | null;
  longitude: number | null;
  latitude: number | null;
  timezone: string | null;
}

export function parseGeo(headers: Headers | Record<string, string | undefined>): GeoInfo {
  // Helper to get a header value regardless of input type.
  // Plain objects in Node.js typically have lowercase keys.
  const getHeader = (key: string): string | null => {
    if (headers instanceof Headers) {
      return headers.get(key);
    }
    return headers[key.toLowerCase()] ?? null;
  };

  return {
    ip:            getHeader('x-real-ip'),
    continentCode: getHeader('x-vercel-ip-continent'),
    countryCode:   getHeader('x-vercel-ip-country'),
    regionCode:    getHeader('x-vercel-ip-country-region'),
    city:          getHeader('x-vercel-ip-city'),
    postalCode:    getHeader('x-vercel-ip-postal-code'),
    longitude:     parseFloat(getHeader('x-vercel-ip-longitude') ?? 'NaN'),
    latitude:      parseFloat(getHeader('x-vercel-ip-latitude') ?? 'NaN'),
    timezone:      getHeader('x-vercel-ip-timezone'),
  };
}
