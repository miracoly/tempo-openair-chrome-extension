import { combine, parseWorkLogsFrom } from './tempo';
import response from '../mocks/worklog-response.json';
import workLogs from '../mocks/workLogs';
import dayjs from 'dayjs';

describe('parseWorkLogsFrom', () => {
  it('should parse response into WorkLogs[]', async () => {
    const parsed = parseWorkLogsFrom(response);

    expect(parsed).toStrictEqual(workLogs);
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
