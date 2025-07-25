import type { Airport } from '../interfaces';
export declare const resolveVisitorContext: (input: Request | Headers | Record<string, string | string[] | undefined>, opts?: import("./createLocator").CreateLocatorOptions) => Promise<import("..").VisitorContext>;
export declare const lookupCountry: (code: string) => Promise<import("..").Country | null>;
export declare const lookupRegion: (code: string) => Promise<import("..").Region | null>;
export declare const lookupCurrency: (code: string) => Promise<import("..").CurrencyDetails | null>;
export declare const lookupLanguage: (code: string) => Promise<import("..").LanguageDetails | null>;
export declare const lookupAirportsByCoords: (lat: number, lon: number, count?: number, filter?: (a: Airport) => boolean) => Promise<Airport[]>;
export declare const lookupAirportByIcao: (code: string) => Promise<Airport | null>;
export declare const lookupAirportByIata: (code: string) => Promise<Airport | null>;
