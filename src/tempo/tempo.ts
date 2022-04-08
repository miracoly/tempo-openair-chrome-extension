import dayjs, { Dayjs } from 'dayjs';
import { DayReport, Report, WorkLog, WorkLogResponse } from './types';
import { accumulate, addParamsTo } from '../utils/utils';

const BASE_URL = 'https://api.tempo.io/core/3';
const WORKLOGS_URL = '/worklogs';

export interface WorkLogFilter {
  issueKey: number;
  from: Dayjs;
  to: Dayjs;
}

export function fetchDayReports(
  days: dayjs.Dayjs[],
  filter: WorkLogFilter,
  token: string,
  callback: (reports: DayReport[]) => void
): void {
  fetchWorkLogs(filter, token, response => {
    const workLogs = parseWorkLogsFrom(response);
    const dayReports = generateDayReport(workLogs, days);
    callback(dayReports);
  });
}

export function fetchWorkLogs(
  filter: WorkLogFilter,
  token: string,
  callback: (response: WorkLogResponse) => void
): void {
  const url = buildUrlFrom(BASE_URL + WORKLOGS_URL, filter);

  fetch(url, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
  })
    .then(response => response.json())
    .then(callback)
    .catch(reason => console.log(`Could not fetch workLogs from tempo, reason: ${reason}`));
}

function buildUrlFrom(baseUrl: string, filter: WorkLogFilter): string {
  const params: Record<string, string> = {
    issue: `TIME-${filter.issueKey}`,
    from: filter.from.format('YYYY-MM-DD'),
    to: filter.to.format('YYYY-MM-DD'),
  };
  return addParamsTo(baseUrl, params);
}

export function parseWorkLogsFrom(response: WorkLogResponse): WorkLog[] {
  return response.results.map(wl => ({
    issueKey: wl.issue.key,
    description: wl.description,
    startDate: dayjs(wl.startDate + 'T' + wl.startTime, 'YYYY-MM-DDTHH:mm:ss'),
    timeSpentSeconds: wl.timeSpentSeconds,
  }));
}

export function generateDayReport(workLogs: WorkLog[], days: dayjs.Dayjs[]): DayReport[] {
  return days
    .map(day => workLogs.filter(wl => wl.startDate.isSame(day, 'date')))
    .map(accumulate(combine)('issueKey', 'description'))
    .map(generateReport)
    .map((report, i) => ({ ...report, day: days[i] }))
    .filter(dayReport => dayReport.totalTimeSpendSeconds != 0);
}

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
