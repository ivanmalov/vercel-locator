import { GeoInfo } from './parse';
export interface Config {
}
export interface VisitorContext extends GeoInfo {
    ip: string | null;
    currency?: string | null;
}
export declare function resolveVisitorContext(input: Request | Headers, opts?: Partial<Config>): VisitorContext;
