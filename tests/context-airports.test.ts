import { describe, expect, test } from 'vitest';
import { createLocator } from '../src/context/createLocator';
import type { AirportIndexItem } from '../src/interfaces';
import { StubLoader } from './stubLoader';

const airports = {
  A1: { id: 'A1', type: 'small_airport', name: 'A1', lat: 10, lon: 10, elevation_ft: null, continent: null, iso_country: 'US', iso_region: 'US-CA', municipality: null, scheduled_service: 'yes', icao_code: 'ICA1', iata_code: 'IA1', gps_code: null, local_code: null },
};
const indexItems: AirportIndexItem[] = [{ minX: 9, minY: 9, maxX: 11, maxY: 11, id: 'A1' }];
const loader = new StubLoader({ airports, indexItems, icaoMap: { ICA1: 'A1' }, iataMap: { IA1: 'A1' } });

const locator = createLocator(loader, { include: { airports: false, region: false } });

test('resolveVisitorContext excludes airports by default', async () => {
  const ctx = await locator({ 'x-vercel-ip-longitude': '10', 'x-vercel-ip-latitude': '10' });
  expect(ctx.airports).toBeNull();
});

test('resolveVisitorContext includes airports when opted', async () => {
  const ctx = await locator({ 'x-vercel-ip-longitude': '10', 'x-vercel-ip-latitude': '10' }, { include: { airports: { count: 1 } } });
  expect(ctx.airports?.length).toBe(1);
});
