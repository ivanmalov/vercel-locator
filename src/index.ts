export {
  resolveVisitorContext,
  lookupCountry,
  lookupRegion,
  lookupCurrency,
  lookupLanguage,
  lookupAirportsByCoords,
  lookupAirportByIcao,
  lookupAirportByIata,
} from './context.js';

export type {
  VisitorContext,
  Config, // Make sure Config is exported
  Country,
  Region,
  Airport,
  CurrencyDetails,
  LanguageDetails,
} from './context.js';
export type { GeoInfo } from './parse.js';