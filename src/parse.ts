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

export function parseGeo(headers: Headers | Record<string, string | string[] | undefined>): GeoInfo {
  // Helper to get a header value regardless of input type.
  // Plain objects in Node.js typically have lowercase keys.
  const getHeader = (key: string): string | null => {
    let value: string | string[] | null | undefined;

    if (headers instanceof Headers) {
      value = headers.get(key);
    } else {
      value = headers[key.toLowerCase()];
    }

    // If the value is an array, return the first element. Otherwise, return the value itself.
    if (Array.isArray(value)) {
      return value[0] ?? null;
    }
    
    return (value as string) ?? null;
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
