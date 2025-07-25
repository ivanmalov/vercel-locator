export type Predicate<T> = (x: T) => boolean;
export declare const and: <T>(...ps: Predicate<T>[]) => (x: T) => boolean;
export declare const or: <T>(...ps: Predicate<T>[]) => (x: T) => boolean;
export declare const not: <T>(p: Predicate<T>) => (x: T) => boolean;
