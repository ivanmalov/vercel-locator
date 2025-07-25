import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('lazy import', async () => {
  it('does not read files on import', async () => {
    const spy = vi.spyOn(fs, 'readFile');
    await import('../src/index');
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('context resolution', () => {
  it('omits airports by default', async () => {
    const { resolveVisitorContext } = await import('../src/index');
    const ctx = await resolveVisitorContext({
      'x-vercel-ip-country': 'US',
      'x-vercel-ip-country-region': 'CA',
      'x-vercel-ip-latitude': '34',
      'x-vercel-ip-longitude': '-118',
    });
    expect(ctx.airports).toBeNull();
  });
});

describe('airport queries', () => {
  it('respects count and filter', async () => {
    const { lookupAirportsByCoords } = await import('../src/index');
    const { hasRegularService } = await import('../src/queries/airports');
    const res = await lookupAirportsByCoords(11.22222, 169.85143, 1, hasRegularService);
    expect(res.length).toBeLessThanOrEqual(1);
    expect(res[0]?.scheduled_service).toBe('yes');

    const none = await lookupAirportsByCoords(11.22222, 169.85143, 1, () => false);
    expect(none.length).toBe(0);
  });

  it('hasRegularService predicate', async () => {
    const { hasRegularService } = await import('../src/queries/airports');
    expect(hasRegularService({ scheduled_service: 'yes' } as any)).toBe(true);
    expect(hasRegularService({ scheduled_service: 'no' } as any)).toBe(false);
  });
});

describe('languages', () => {
  it('filters by status and percentage', async () => {
    const { listCountryLanguages } = await import('../src/queries/languages');
    const { FSLoader } = await import('../src/data/fs-loader');
    const { MemoryCacheLoader } = await import('../src/data/memory-cache');
    const loader = new MemoryCacheLoader(new FSLoader(path.join(__dirname, '../src/generated')));
    const langs = await listCountryLanguages(loader, 'AD', { officialOnly: true, minPercentage: 10 });
    expect(langs.every(l => (l.status ?? '').toLowerCase() === 'official')).toBe(true);
    expect(langs.every(l => (l.percentage ?? 0) >= 10)).toBe(true);
  });
});

describe('errors', () => {
  it('throws typed errors on missing data', async () => {
    const { FSLoader } = await import('../src/data/fs-loader');
    const loader = new FSLoader('nonexistent');
    await expect(loader.loadCountries()).rejects.toHaveProperty('name', 'DataLoadError');
  });
});
