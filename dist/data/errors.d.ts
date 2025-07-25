export declare class DataLoadError extends Error {
    cause?: unknown | undefined;
    constructor(message: string, cause?: unknown | undefined);
}
