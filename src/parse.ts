export interface GeoInfo {
  countryCode: string | null;
  countryName: string | null;
  regionCode: string | null;
  city: string | null;
  postalCode: string | null;
}

export function parseGeo(headers: Headers): GeoInfo {
  return {
    countryCode: headers.get('x-vercel-ip-country') ?? null,
    countryName: null,  // we’ll fill this in later when we add a map
    regionCode:  headers.get('x-vercel-ip-country-region') ?? null,
    city:        headers.get('x-vercel-ip-city') ?? null,
    postalCode:  headers.get('x-vercel-ip-postal-code') ?? null,
  };
}
