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
    iata: string;
    name: string;
    city: string;
    country: string;
    lat: number;
    lon: number;
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
