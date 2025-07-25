export const and = (...ps) => (x) => ps.every(p => p(x));
export const or = (...ps) => (x) => ps.some(p => p(x));
export const not = (p) => (x) => !p(x);
