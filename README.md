# Vercel Locator

Utilities for looking up geographic, currency, language and airport information from static JSON datasets. Designed to be lazy and tree‑shakeable.

## Basic usage

```ts
import { resolveVisitorContext } from 'vercel-locator';

const ctx = await resolveVisitorContext(request.headers);
console.log(ctx.country?.name.common);
```

## Including nearby airports

```ts
import { resolveVisitorContext } from 'vercel-locator';

const ctx = await resolveVisitorContext(request.headers, {
  include: { airports: { count: 2, regularServiceOnly: true } }
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
import { listCountryLanguages } from 'vercel-locator/dist/queries/languages';

const langs = await listCountryLanguages(loader, 'US', { officialOnly: true });
```
