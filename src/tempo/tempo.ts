import dayjs, { Dayjs } from 'dayjs';
import { DayReport, Report, WorkLog, WorkLogResponse } from './types';
import { TOKEN } from '../secrets';
import { accumulate, addParamsTo } from '../utils/utils';

const BASE_URL = 'https://api.tempo.io/core/3';

export function getDayReportsFromTempo(issueKey: number, days: Dayjs[]): Promise<DayReport[]> {
  return fetchWorkLogs(issueKey, days[0], days[days.length - 1])
    .then(parseWorkLogsFrom)
    .then(generateDayReport(days));
}

export function fetchWorkLogs(issueKey: number, from: Dayjs, to: Dayjs): Promise<WorkLogResponse> {
  const params: Record<string, string> = {
    issue: `TIME-${issueKey}`,
    from: from.format('YYYY-MM-DD'),
    to: to.format('YYYY-MM-DD'),
  };
  const url = addParamsTo(BASE_URL + '/worklogs', params);

  return fetch(url, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + TOKEN },
  })
    .then(response => response.json())
    .catch(reason => console.log(reason));
}

export function parseWorkLogsFrom(response: WorkLogResponse): WorkLog[] {
  return response.results.map(wl => ({
    issueKey: wl.issue.key,
    description: wl.description,
    startDate: dayjs(wl.startDate + 'T' + wl.startTime, 'YYYY-MM-DDTHH:mm:ss'),
    timeSpentSeconds: wl.timeSpentSeconds,
  }));
}

export function generateDayReport(days: dayjs.Dayjs[]) {
  return (workLogs: WorkLog[]): DayReport[] =>
    days
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
