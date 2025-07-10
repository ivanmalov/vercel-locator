interface Airport {
    name: string;
    latitude_deg: number | null;
    longitude_deg: number | null;
    [key: string]: any;
}
/**
 * Finds the nearest airports to a given latitude and longitude.
 * @param lat The latitude.
 * @param lon The longitude.
 * @param count The maximum number of airports to return.
 * @returns An array of the nearest airports.
 */
export declare function findNearestAirports(lat: number, lon: number, count?: number): Airport[];
export {};
