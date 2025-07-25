import type { DataLoader } from '../data/loader';
import type { VisitorContext, Config } from '../interfaces';
export interface IncludeOptions {
    airports?: boolean | {
        count?: number;
        regularServiceOnly?: boolean;
    };
    region?: boolean;
}
export interface CreateLocatorOptions extends Partial<Config> {
    include?: IncludeOptions;
}
export declare function createLocator(loader: DataLoader, defaults?: CreateLocatorOptions): (input: Request | Headers | Record<string, string | string[] | undefined>, opts?: CreateLocatorOptions) => Promise<VisitorContext>;
