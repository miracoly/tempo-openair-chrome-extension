import { accumulate, addParamsTo, groupBy } from './utils';
import workLogsOneDay from '../mocks/workLogsOneDay';
import { combine } from '../tempo/tempo';
import workLogsOneDayAccumulated from '../mocks/workLogsOneDayAccumulated';
import workLogs from '../mocks/workLogs';
import workLogsAccumulated from '../mocks/workLogsAccumulated';
import workLogsGroupedByDescription from '../mocks/workLogsGroupedByDescription';

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
