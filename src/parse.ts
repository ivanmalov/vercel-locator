export interface GeoInfo {
  continentCode: string | null;  
  countryCode: string | null;
  regionCode: string | null;
  city: string | null;
  postalCode: string | null;
  longitude: number | null;
  latitude: number | null;
  timezone: string | null;
}

export function parseGeo(headers: Headers): GeoInfo {
  return {
    continentCode: headers.get('x-vercel-ip-continent') ?? null,
    countryCode:   headers.get('x-vercel-ip-country') ?? null,
    regionCode:    headers.get('x-vercel-ip-country-region') ?? null,
    city:          headers.get('x-vercel-ip-city') ?? null,
    postalCode:    headers.get('x-vercel-ip-postal-code') ?? null,
    longitude:     parseFloat(headers.get('x-vercel-ip-longitude') ?? 'NaN'),
    latitude:      parseFloat(headers.get('x-vercel-ip-latitude') ?? 'NaN'),
    timezone:      headers.get('x-vercel-ip-timezone') ?? null,
  };
}
