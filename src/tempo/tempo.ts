import dayjs, { Dayjs } from 'dayjs';
import { WorkLog, WorkLogResponse } from './types';
import { TOKEN } from '../secrets';

const BASE_URL = 'https://api.tempo.io/core/3';

export async function fetchWorkLogs(
  issueKey: number,
  from: Dayjs,
  to: Dayjs
): Promise<WorkLogResponse> {
  const params: Record<string, string> = {
    issue: `TIME-${issueKey}`,
    from: from.format('YYYY-MM-DD'),
    to: to.format('YYYY-MM-DD'),
  };
  const url = addParamsTo(BASE_URL + '/workLogs', params);

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + TOKEN },
  });

  return response.json();
}

export function parseWorkLogsFrom(response: WorkLogResponse): WorkLog[] {
  return response.results.map(wl => ({
    issueKey: wl.issue.key,
    description: wl.description,
    startDate: dayjs(wl.startDate + 'T' + wl.startTime, 'YYYY-MM-DDTHH:mm:ss'),
    timeSpentSeconds: wl.timeSpentSeconds,
  }));
}

export function accumulate(workLogs: WorkLog[]) {
  return (...by: (keyof WorkLog)[]): WorkLog[] => {
    return workLogs.reduce((accumulated, curr, _, arr) => {
      const issueKey = curr.issueKey;
      const description = curr.description;

      const currentAlreadyAccumulated =
        by.reduce(
          (filtered, key) => filtered.filter(value => value[key] === curr[key]),
          accumulated
        ).length >= 1;

      if (currentAlreadyAccumulated) {
        return accumulated;
      }

      const toAccumulate = arr
        .filter(value => value.issueKey === issueKey)
        .filter(value => value.description === description);
      const combined: WorkLog = toAccumulate.reduce(combine);

      return [...accumulated, combined];
    }, [] as WorkLog[]);
  };
}

export function combine(wl1: WorkLog, wl2: WorkLog): WorkLog {
  return {
    issueKey: wl1.issueKey,
    description: wl1.description,
    startDate: wl1.startDate.isBefore(wl2.startDate) ? wl1.startDate : wl2.startDate,
    timeSpentSeconds: wl1.timeSpentSeconds + wl2.timeSpentSeconds,
  };
}

export function addParamsTo(url: string, params: Record<string, string>): string {
  const newUrl = new URL(url);
  newUrl.search = new URLSearchParams(params).toString();

  return newUrl.toString();
}
