import path from 'path';
import { fileURLToPath } from 'url';
import { FSLoader } from '../data/fs-loader.js';
import { MemoryCacheLoader } from '../data/memory-cache.js';
import { createLocator } from './createLocator.js';
import * as C from '../queries/countries.js';
import * as R from '../queries/regions.js';
import * as Cur from '../queries/currencies.js';
import * as L from '../queries/languages.js';
import * as A from '../queries/airports.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const loader = new MemoryCacheLoader(new FSLoader(path.join(__dirname, '../generated')));
export const resolveVisitorContext = createLocator(loader, {
    include: { airports: false, region: true },
});
export const lookupCountry = (code) => C.lookupCountry(loader, code);
export const lookupRegion = (code) => R.lookupRegion(loader, code);
export const lookupCurrency = (code) => Cur.lookupCurrency(loader, code);
export const lookupLanguage = (code) => L.lookupLanguage(loader, code);
export const lookupAirportsByCoords = (lat, lon, opts) => A.lookupAirportsByCoords(loader, lat, lon, opts ?? {});
export const lookupAirportByIcao = (code) => A.lookupAirportByIcao(loader, code);
export const lookupAirportByIata = (code) => A.lookupAirportByIata(loader, code);
