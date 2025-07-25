export async function lookupLanguage(loader, code) {
    const languages = await loader.loadLanguages();
    return languages[code] ?? null;
}
export async function listCountryLanguages(loader, countryCode, filter = {}) {
    const countries = await loader.loadCountries();
    const country = countries[countryCode.toUpperCase()];
    if (!country)
        return [];
    let list = country.languages;
    if (filter.officialOnly) {
        list = list.filter(l => (l.status ?? '').toLowerCase() === 'official');
    }
    if (filter.minPercentage != null) {
        list = list.filter(l => (l.percentage ?? 0) >= filter.minPercentage);
    }
    if (filter.predicate) {
        list = list.filter(filter.predicate);
    }
    return list;
}
