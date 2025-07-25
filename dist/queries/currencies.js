export async function lookupCurrency(loader, code) {
    const currencies = await loader.loadCurrencies();
    return currencies[code.toUpperCase()] ?? null;
}
