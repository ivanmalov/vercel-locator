import type { DataLoader } from '../data/loader.js';
import type { Region } from '../interfaces.js';
export declare function lookupRegion(loader: DataLoader, code: string): Promise<Region | null>;
