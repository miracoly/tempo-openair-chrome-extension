import { accumulate, addParamsTo, combine, parseWorkLogsFrom } from './tempo';
import response from '../mocks/worklog-response.json';
import workLogs from '../mocks/workLogs';
import workLogsAccumulated from '../mocks/workLogsAccumulated';
import workLogsOneDay from '../mocks/workLogsOneDay';
import workLogsOneDayAccumulated from '../mocks/workLogsOneDayAccumulated';
import dayjs from 'dayjs';

describe('parseWorkLogsFrom', () => {
  it('should parse response into WorkLogs[]', async () => {
    const parsed = parseWorkLogsFrom(response);

    expect(parsed).toStrictEqual(workLogs);
  });
});

describe('accumulateBy', () => {
  it('should accumulate workLogs of one day by description and issueKey', () => {
    const accumulated = accumulate(workLogsOneDay)('description', 'issueKey');

    expect(accumulated).toStrictEqual(workLogsOneDayAccumulated);
  });

  it('should accumulate workLogs of different days bey description and issueKey', () => {
    const accumulated = accumulate(workLogs)('description', 'issueKey');

    expect(accumulated).toStrictEqual(workLogsAccumulated);
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

describe('addParamsTo', () => {
  it('should return url with params', () => {
    const params: Record<string, string> = {
      issue: 'TIME-254',
      from: '2022-03-21',
      to: '2022-03-27',
    };

    const url = addParamsTo('https://api.tempo.io/core/3/worklogs', params);
    const expectedUrl =
      'https://api.tempo.io/core/3/worklogs?issue=TIME-254&from=2022-03-21&to=2022-03-27';

    expect(url).toBe(expectedUrl);
  });
});
