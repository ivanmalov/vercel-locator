import type { DataLoader } from '../data/loader.js';
import type { Region } from '../interfaces.js';

export async function lookupRegion(loader: DataLoader, code: string): Promise<Region | null> {
  const regions = await loader.loadRegions();
  return regions[code.toUpperCase()] ?? null;
}
