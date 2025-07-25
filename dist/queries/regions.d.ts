import type { DataLoader } from '../data/loader';
import type { Region } from '../interfaces';
export declare function lookupRegion(loader: DataLoader, code: string): Promise<Region | null>;
