import { combine, generateReport, getWorkLogReportOf, parseWorkLogsFrom} from './tempo';
import response from '../mocks/worklog-response.json';
import workLogResponse from '../mocks/worklog-response.json';
import workLogs from '../mocks/workLogs';
import dayjs from 'dayjs';
import { newDayRange } from '../utils/utils';
import fullWorkLogDayReport from '../mocks/fullWorkLogDayReport';
import fetchMock from 'jest-fetch-mock';
import { Report } from './types';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
})

describe('getWorkLogReportOf', ()=> {
  it('should generate report of full week', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(workLogResponse));
    const week = newDayRange(dayjs('2022-03-21'), dayjs('2022-03-27'));

    const reports = await getWorkLogReportOf(256, week);

    expect(reports).toStrictEqual(fullWorkLogDayReport);
  });
})

// TODO
describe('fetchWorkLogs', () => {
  it('should fetch with correct parameters', () => {

  })
})

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
