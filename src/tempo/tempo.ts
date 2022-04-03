import dayjs, { Dayjs } from 'dayjs';
import { WorkLog, WorkLogResponse } from './types';
import { TOKEN } from '../secrets';

const BASE_URL = 'https://api.tempo.io/core/3';

export async function fetchWorkLogs(issueKey: number, from: Dayjs, to: Dayjs): Promise<WorkLogResponse> {
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
    startDate: dayjs(wl.startDate),
    timeSpentSeconds: wl.timeSpentSeconds
  }));
}

export function addParamsTo(url: string, params: Record<string, string>): string {
  const newUrl = new URL(url);
  newUrl.search = new URLSearchParams(params).toString();

  return newUrl.toString();
}
