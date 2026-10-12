interface Config<U> {
  get<T extends keyof U>(key: T): U[T];
}

export default Config;
