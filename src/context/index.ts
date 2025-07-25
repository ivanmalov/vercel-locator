import path from 'path';
import { fileURLToPath } from 'url';
import { FSLoader } from '../data/fs-loader';
import { MemoryCacheLoader } from '../data/memory-cache';
import { createLocator } from './createLocator';
import * as C from '../queries/countries';
import * as R from '../queries/regions';
import * as Cur from '../queries/currencies';
import * as L from '../queries/languages';
import * as A from '../queries/airports';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const loader = new MemoryCacheLoader(new FSLoader(path.join(__dirname, '../generated')));

export const resolveVisitorContext = createLocator(loader, {
  include: { airports: false, region: true },
});

export const lookupCountry = (code: string) => C.lookupCountry(loader, code);
export const lookupRegion = (code: string) => R.lookupRegion(loader, code);
export const lookupCurrency = (code: string) => Cur.lookupCurrency(loader, code);
export const lookupLanguage = (code: string) => L.lookupLanguage(loader, code);

export const lookupAirportsByCoords = (
  lat: number,
  lon: number,
  opts?: A.AirportOptions
) => A.lookupAirportsByCoords(loader, lat, lon, opts ?? {});

export const lookupAirportByIcao = (code: string) => A.lookupAirportByIcao(loader, code);
export const lookupAirportByIata = (code: string) => A.lookupAirportByIata(loader, code);
