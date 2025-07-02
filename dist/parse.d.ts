export interface GeoInfo {
    countryCode: string | null;
    countryName: string | null;
    regionCode: string | null;
    city: string | null;
    postalCode: string | null;
}
export declare function parseGeo(headers: Headers): GeoInfo;
