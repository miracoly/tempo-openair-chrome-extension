export function accumulate<T>(objects: T[], combineFn: (v1: T, v2: T) => T) {
  return (...by: (keyof T)[]): T[] =>
    objects.reduce((accumulated, curr, _, arr) => {
      const currentAlreadyAccumulated =
        by.reduce((filtered, key) => filtered.filter(obj => obj[key] === curr[key]), accumulated)
          .length >= 1;
      if (currentAlreadyAccumulated) {
        return accumulated;
      }

      const combined: T = by
        .reduce((filtered, key) => filtered.filter(obj => obj[key] === curr[key]), arr)
        .reduce(combineFn);
      return [...accumulated, combined];
    }, [] as T[]);
}

export function addParamsTo(url: string, params: Record<string, string>): string {
  const newUrl = new URL(url);
  newUrl.search = new URLSearchParams(params).toString();

  return newUrl.toString();
}