declare module 'rbush-knn' {
  import RBush from 'rbush';

  function knn<T>(
    tree: RBush<T>,
    x: number,
    y: number,
    n?: number,
    predicate?: (item: T) => boolean,
    maxDistance?: number
  ): T[];

  export = knn;
}