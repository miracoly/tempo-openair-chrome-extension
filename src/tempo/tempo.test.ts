import { combine, generateReport, parseWorkLogsFrom, Report } from './tempo';
import response from '../mocks/worklog-response.json';
import workLogs from '../mocks/workLogs';
import dayjs from 'dayjs';

describe('parseWorkLogsFrom', () => {
  it('should parse response into WorkLogs[]', async () => {
    const parsed = parseWorkLogsFrom(response);

    expect(parsed).toStrictEqual(workLogs);
  });
});

describe('generateReport', () => {
  it('should sum time and concat all descriptions', () => {
    const day = dayjs('2022-03-22');
    const worklogsOneDay = workLogs.filter(wl => wl.startDate.isSame(day, 'date'));
    const expected: Report = {
      totalTimeSpendSeconds: 900 + 1800 + 7200 + 7200 + 1800,
      descriptions: [
        'Daily',
        'Live Deployments Discussion',
        '#116533: CC: Critical Vulnerability found in Tisax Nightly for netty:netty 2.0.48',
        '#116533: CC: Critical Vulnerability found in Tisax Nightly for netty:netty 2.0.48',
        'UX / UI / FE Sync',
      ],
    };

    const report = generateReport(worklogsOneDay);

    expect(report).toStrictEqual(expected);
  });
});

describe('combine', () => {
  it('should take first description and first date if different, but sums timeSpendSeconds', () => {
    const combined = combine(workLogs[0], workLogs[1]);
    const expected = {
      issueKey: 'TIME-254',
      timeSpentSeconds: 2700,
      startDate: dayjs('2022-03-22T09:15:00'),
      description: 'Daily',
    };

    expect(combined).toStrictEqual(expected);
  });
});
