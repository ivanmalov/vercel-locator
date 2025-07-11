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
    country: Country | null;
    region: Region | null;
    airports: Airport[] | null;
}
export declare function resolveVisitorContext(input: Request | Headers | Record<string, string | string[] | undefined>, opts?: Partial<Config>): Promise<VisitorContext>;
/**
 * Looks up a country by its ISO 3166-1 alpha-2 code.
 * @param code The two-letter country code (e.g., "US").
 * @returns A Country object or null if not found.
 */
export declare function lookupCountry(code: string): Promise<Country | null>;
/**
 * Looks up a region by its ISO 3166-2 code.
 * @param code The region code (e.g., "US-CA").
 * @returns A Region object or null if not found.
 */
export declare function lookupRegion(code: string): Promise<Region | null>;
/**
 * Finds the nearest airport(s) to a given set of coordinates, with an optional filter.
 * @param lat The latitude.
 * @param lon The longitude.
 * @param count The number of airports to return. Defaults to 10.
 * @param filter An optional function to filter the results.
 * @returns An array of Airport objects.
 */
export declare function lookupAirportsByCoords(lat: number, lon: number, count?: number, filter?: (airport: Airport) => boolean): Promise<Airport[]>;
/**
 * Looks up an airport by its ICAO code.
 * @param code The 4-letter ICAO code (e.g., "KLAX").
 * @returns An Airport object or null if not found.
 */
export declare function lookupAirportByIcao(code: string): Promise<Airport | null>;
/**
 * Looks up an airport by its IATA code.
 * @param code The 3-letter IATA code (e.g., "LAX").
 * @returns An Airport object or null if not found.
 */
export declare function lookupAirportByIata(code: string): Promise<Airport | null>;
