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
export declare function parseGeo(headers: Headers | Record<string, string | undefined>): GeoInfo;
