import dayjs, { Dayjs } from 'dayjs';
import { WorkLog, WorkLogResponse } from './types';
import { TOKEN } from '../secrets';
import { accumulate, addParamsTo } from '../utils/utils';

const BASE_URL = 'https://api.tempo.io/core/3';

export async function getWorkLogReportOf(issueKey: number, days: Dayjs[]): Promise<DayReport[]> {
  const response = await fetchWorkLogs(issueKey, days[0], days[days.length - 1]);
  const workLogs = parseWorkLogsFrom(response);

  return days
    .map(day => workLogs.filter(wl => wl.startDate.isSame(day, 'date')))
    .map(wls => accumulate(wls, combine)('issueKey', 'description'))
    .map(generateReport)
    .map((report, i) => ({ ...report, day: days[i] }))
    .filter(dayReport => dayReport.totalTimeSpendSeconds != 0);
}

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
  const url = addParamsTo(BASE_URL + '/worklogs', params);

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

export type Report = {
  totalTimeSpendSeconds: number;
  descriptions: string[];
};
export type DayReport = Report & { day: Dayjs };

export function generateReport(workLogs: WorkLog[]): Report {
  const totalTimeSpendSeconds = workLogs
    .map(wl => wl.timeSpentSeconds)
    .reduce((prev, curr) => prev + curr, 0);
  const descriptions = workLogs.map(wl => wl.description);
  return { totalTimeSpendSeconds, descriptions };
}

export function combine(wl1: WorkLog, wl2: WorkLog): WorkLog {
  return {
    issueKey: wl1.issueKey,
    description: wl1.description,
    startDate: wl1.startDate.isBefore(wl2.startDate) ? wl1.startDate : wl2.startDate,
    timeSpentSeconds: wl1.timeSpentSeconds + wl2.timeSpentSeconds,
  };
}
