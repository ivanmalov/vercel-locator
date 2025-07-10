"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNearestAirports = findNearestAirports;
const rbush_1 = __importDefault(require("rbush"));
const airports_json_1 = __importDefault(require("./generated/airports/airports.json"));
const index_json_1 = __importDefault(require("./generated/airports/index.json"));
class AirportBush extends rbush_1.default {
}
const allAirports = airports_json_1.default;
const tree = new AirportBush().fromJSON(index_json_1.default);
/**
 * Finds the nearest airports to a given latitude and longitude.
 * @param lat The latitude.
 * @param lon The longitude.
 * @param count The maximum number of airports to return.
 * @returns An array of the nearest airports.
 */
function findNearestAirports(lat, lon, count = 10) {
    const results = tree.knn(lon, lat, count);
    return results.map(item => allAirports[item.code]);
}
