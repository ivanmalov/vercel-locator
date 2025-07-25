export class DataLoadError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'DataLoadError';
  }
}
