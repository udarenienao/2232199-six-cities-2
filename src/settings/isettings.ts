export interface ISettings<U> {
    get<T extends keyof U>(key: T): U[T];
  }
