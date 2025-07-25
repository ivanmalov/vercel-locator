export type Predicate<T> = (x: T) => boolean;
export const and = <T>(...ps: Predicate<T>[]) => (x: T) => ps.every(p => p(x));
export const or  = <T>(...ps: Predicate<T>[]) => (x: T) => ps.some(p => p(x));
export const not = <T>(p: Predicate<T>) => (x: T) => !p(x);
