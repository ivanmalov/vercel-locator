import { GeoInfo } from './parse';
export interface Country {
    name: {
        common: string;
        official: string;
        commonArticle: string | null;
        officialArticle: string | null;
    };
    topLevelDomain: string | null;
    currency: {
        code: string;
        name: string;
        singular: string;
        plural: string;
        symbol: string;
    } | null;
    phone: string | null;
    languages: {
        code: string;
        name: string;
        percentage: number | null;
        status: string | null;
    }[];
}
export interface Region {
    name: string;
}
export interface Airport {
    id: string;
    type: string;
    name: string;
    lat: number;
    lon: number;
    elevation_ft: number | null;
    continent: string | null;
    iso_country: string;
    iso_region: string;
    municipality: string | null;
    scheduled_service: string;
    icao_code: string | null;
    iata_code: string | null;
    gps_code: string | null;
    local_code: string | null;
}
export interface Config {
    nearbyAirports?: number;
}
export interface VisitorContext extends GeoInfo {
    ip: string | null;
    country: Country | null;
    region: Region | null;
    airports: Airport[] | null;
}
export declare function resolveVisitorContext(input: Request | Headers, opts?: Partial<Config>): VisitorContext;
