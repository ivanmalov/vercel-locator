# Vercel Locator

Utilities for working with geolocation headers on Vercel. Provides lazy, filterable lookup functions for countries, regions, currencies, languages and airports.

## Installation

```bash
npm install vercel-locator
```

## Basic usage

```ts
import { resolveVisitorContext } from 'vercel-locator';

const context = await resolveVisitorContext(request.headers);
// context.airports is null by default
```

## Including airports

```ts
import { resolveVisitorContext } from 'vercel-locator';

const context = await resolveVisitorContext(request.headers, {
  include: {
    airports: { count: 5, regularServiceOnly: true },
  },
});
```

## Direct lookups

```ts
import { lookupCountry, lookupAirportByIcao } from 'vercel-locator';

const country = await lookupCountry('US');
const lax = await lookupAirportByIcao('KLAX');
```

## Listing official languages

```ts
import { listCountryLanguages } from 'vercel-locator/queries/languages';
import { FSLoader } from 'vercel-locator/data/fs-loader';
import { MemoryCacheLoader } from 'vercel-locator/data/memory-cache';

const loader = new MemoryCacheLoader(new FSLoader('./dist/generated'));
const languages = await listCountryLanguages(loader, 'AD', { officialOnly: true });
```
