import { expect, test } from 'vitest';
import { lookupAirportsByCoords, hasRegularService } from '../src/queries/airports';
import { StubLoader } from './stubLoader';
import type { AirportIndexItem } from '../src/interfaces';

const airports = {
  A1: { id: 'A1', type: 'small_airport', name: 'A1', lat: 10, lon: 10, elevation_ft: null, continent: null, iso_country: 'US', iso_region: 'US-CA', municipality: null, scheduled_service: 'yes', icao_code: 'ICA1', iata_code: 'IA1', gps_code: null, local_code: null },
  A2: { id: 'A2', type: 'small_airport', name: 'A2', lat: 11, lon: 11, elevation_ft: null, continent: null, iso_country: 'US', iso_region: 'US-CA', municipality: null, scheduled_service: 'no', icao_code: 'ICA2', iata_code: 'IA2', gps_code: null, local_code: null },
};
const indexItems: AirportIndexItem[] = [
  { minX: 9, minY: 9, maxX: 11, maxY: 11, id: 'A1' },
  { minX: 10, minY: 10, maxX: 12, maxY: 12, id: 'A2' },
];
const loader = new StubLoader({ airports, indexItems, icaoMap: { ICA1: 'A1', ICA2: 'A2' }, iataMap: { IA1: 'A1', IA2: 'A2' } });

test('hasRegularService predicate', () => {
  expect(hasRegularService(airports.A1)).toBe(true);
  expect(hasRegularService(airports.A2)).toBe(false);
});

test('lookupAirportsByCoords respects count and filter', async () => {
  const result = await lookupAirportsByCoords(loader, 10, 10, { count: 1, filter: hasRegularService });
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('A1');
});
