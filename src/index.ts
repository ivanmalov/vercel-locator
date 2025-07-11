export {
  resolveVisitorContext,
  lookupCountry,
  lookupRegion,
  lookupAirportsByCoords,
  lookupAirportByIcao,
  lookupAirportByIata,
} from './context';

export type {
  VisitorContext,
  Config, // Make sure Config is exported
  Country,
  Region,
  Airport,
} from './context';
export type { GeoInfo } from './parse';
