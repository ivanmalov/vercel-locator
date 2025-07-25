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
export declare function parseGeo(headers: Headers | Record<string, string | string[] | undefined>): GeoInfo;
