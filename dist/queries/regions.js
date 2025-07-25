export async function lookupRegion(loader, code) {
    const regions = await loader.loadRegions();
    return regions[code.toUpperCase()] ?? null;
}
