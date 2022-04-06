import { Dayjs } from 'dayjs';

export function accumulate<T>(combineFn: (obj1: T, obj2: T) => T) {
  return (...byKeys: (keyof T)[]) =>
    (objects: T[]): T[] =>
      objects.reduce((accumulated, curr, _, arr) => {
        const currentAlreadyAccumulated =
          byKeys.reduce((filtered, key) => filtered.filter(obj => obj[key] === curr[key]), accumulated)
            .length >= 1;
        if (currentAlreadyAccumulated) {
          return accumulated;
        }

        const combined: T = byKeys
          .reduce((filtered, key) => filtered.filter(obj => obj[key] === curr[key]), arr)
          .reduce(combineFn);
        return [...accumulated, combined];
      }, [] as T[]);
}

export function newDayRange(from: Dayjs, to: Dayjs): Dayjs[] {
  return [...Array(to.diff(from, 'day') + 1).keys()].map(num => from.add(num, 'day'));
}

export function addParamsTo(url: string, params: Record<string, string>): string {
  const newUrl = new URL(url);
  newUrl.search = new URLSearchParams(params).toString();

  return newUrl.toString();
}

export function toHourString(seconds: number) {
  return (seconds / 3600).toString();
}