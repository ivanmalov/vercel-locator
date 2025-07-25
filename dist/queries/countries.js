export async function lookupCountry(loader, code) {
    const countries = await loader.loadCountries();
    return countries[code.toUpperCase()] ?? null;
}
