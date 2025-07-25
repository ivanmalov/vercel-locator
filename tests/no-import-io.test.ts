import { vi, expect, test } from 'vitest';
import { FSLoader } from '../src/data/fs-loader';

// Ensure constructing loader does not trigger load

test('no data load on import', async () => {
  const spy = vi.spyOn(FSLoader.prototype, 'loadCountries');
  await import('../src/index.ts');
  expect(spy).not.toHaveBeenCalled();
});
