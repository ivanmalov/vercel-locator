let knn;
export const hasRegularService = a => a.scheduled_service === 'yes';
export async function lookupAirportsByCoords(loader, lat, lon, opts = {}) {
    const { airports, airportIndex } = await loader.loadAirports();
    if (!knn) {
        knn = (await import('rbush-knn')).default;
    }
    const searchCount = opts.filter ? Math.max(opts.count ?? 10, 500) : (opts.count ?? 10);
    const nearest = knn(airportIndex, lon, lat, searchCount);
    const filter = opts.filter ?? (() => true);
    const out = [];
    for (const item of nearest) {
        const a = airports[item.id];
        if (a && filter(a)) {
            out.push(a);
            if (out.length >= (opts.count ?? 10))
                break;
        }
    }
    return out;
}
export async function lookupAirportByIcao(loader, code) {
    const { airports, icaoMap } = await loader.loadAirports();
    const id = icaoMap[code.toUpperCase()];
    return id ? airports[id] ?? null : null;
}
export async function lookupAirportByIata(loader, code) {
    const { airports, iataMap } = await loader.loadAirports();
    const id = iataMap[code.toUpperCase()];
    return id ? airports[id] ?? null : null;
}
