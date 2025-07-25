import { expect, test } from 'vitest';
import { listCountryLanguages } from '../src/queries/languages';
import { StubLoader } from './stubLoader';

const loader = new StubLoader({
  countries: {
    US: {
      name: { common: 'US', official: 'US', commonArticle: null, officialArticle: null },
      topLevelDomain: null,
      currency: null,
      phone: null,
      languages: [
        { code: 'en', percentage: 80, status: 'official' },
        { code: 'es', percentage: 12, status: 'recognized' },
      ],
    },
  },
});

test('listCountryLanguages filters', async () => {
  const list = await listCountryLanguages(loader, 'US', { officialOnly: true, minPercentage: 50 });
  expect(list.length).toBe(1);
  expect(list[0].code).toBe('en');
});
