import * as A from '../queries/airports.js';
export declare const resolveVisitorContext: (input: Request | Headers | Record<string, string | string[] | undefined>, opts?: import("./createLocator.js").CreateLocatorOptions) => Promise<import("../interfaces.js").VisitorContext>;
export declare const lookupCountry: (code: string) => Promise<import("../interfaces.js").Country | null>;
export declare const lookupRegion: (code: string) => Promise<import("../interfaces.js").Region | null>;
export declare const lookupCurrency: (code: string) => Promise<import("../interfaces.js").CurrencyDetails | null>;
export declare const lookupLanguage: (code: string) => Promise<import("../interfaces.js").LanguageDetails | null>;
export declare const lookupAirportsByCoords: (lat: number, lon: number, opts?: A.AirportOptions) => Promise<import("../interfaces.js").Airport[]>;
export declare const lookupAirportByIcao: (code: string) => Promise<import("../interfaces.js").Airport | null>;
export declare const lookupAirportByIata: (code: string) => Promise<import("../interfaces.js").Airport | null>;
