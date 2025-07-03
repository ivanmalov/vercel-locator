"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVisitorContext = resolveVisitorContext;
const parse_1 = require("./parse");
function resolveVisitorContext(input, opts = {}) {
    var _a;
    const headers = input instanceof Request ? input.headers : input;
    const geo = (0, parse_1.parseGeo)(headers);
    // Assemble once and return
    return Object.assign({ ip: (_a = headers.get('x-real-ip')) !== null && _a !== void 0 ? _a : null }, geo);
}
