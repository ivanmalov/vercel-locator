import { GeoInfo } from './parse';
import { Country } from './generated/countries';
export interface Config {
}
export interface VisitorContext extends GeoInfo {
    ip: string | null;
    country: Country | null;
}
export declare function resolveVisitorContext(input: Request | Headers, opts?: Partial<Config>): VisitorContext;
