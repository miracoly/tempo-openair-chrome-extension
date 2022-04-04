import { accumulate, addParamsTo, groupBy, newDayRange } from './utils';
import workLogsOneDay from '../mocks/workLogsOneDay';
import { combine } from '../tempo/tempo';
import workLogsOneDayAccumulated from '../mocks/workLogsOneDayAccumulated';
import workLogs from '../mocks/workLogs';
import workLogsAccumulated from '../mocks/workLogsAccumulated';
import workLogsGroupedByDescription from '../mocks/workLogsGroupedByDescription';
import dayjs from 'dayjs';

describe('accumulate', () => {
  it('should accumulate workLogs of one day by description and issueKey', () => {
    const accumulated = accumulate(workLogsOneDay, combine)('description', 'issueKey');

    expect(accumulated).toStrictEqual(workLogsOneDayAccumulated);
  });

  it('should accumulate workLogs of different days bey description and issueKey', () => {
    const accumulated = accumulate(workLogs, combine)('description', 'issueKey');

    expect(accumulated).toStrictEqual(workLogsAccumulated);
  });
});

describe('newDayRange', () => {
  it('should create an array of DayJs between two days inclusive boundaries', () => {
    const expected = [
      dayjs('2022-03-21'),
      dayjs('2022-03-22'),
      dayjs('2022-03-23'),
      dayjs('2022-03-24'),
      dayjs('2022-03-25'),
      dayjs('2022-03-26'),
      dayjs('2022-03-27'),
    ];

    const range = newDayRange(dayjs('2022-03-21'), dayjs('2022-03-27'));

    expect(range).toStrictEqual(expected);
  });

  it('should create an array of DayJs between two days over end of month', () => {
    const expected = [
      dayjs('2022-03-27'),
      dayjs('2022-03-28'),
      dayjs('2022-03-29'),
      dayjs('2022-03-30'),
      dayjs('2022-03-31'),
      dayjs('2022-04-01'),
      dayjs('2022-04-02'),
    ];

    const range = newDayRange(dayjs('2022-03-27'), dayjs('2022-04-02'));

    expect(range).toStrictEqual(expected);
  });
})

describe('groupby', () => {
  it('should group workLogs by description', () => {
    const grouped = groupBy(workLogs, 'description');

    expect(grouped).toStrictEqual(workLogsGroupedByDescription);
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
