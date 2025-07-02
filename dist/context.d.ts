import { GeoInfo } from './parse';
export interface Config {
}
export interface VisitorContext extends GeoInfo {
    ip: string | null;
    headers: Record<string, string | undefined>;
}
export declare function resolveVisitorContext(input: Request | Headers, opts?: Partial<Config>): VisitorContext;
