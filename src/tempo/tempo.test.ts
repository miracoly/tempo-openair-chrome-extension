import { addParamsTo, parseWorkLogsFrom } from './tempo';
import response from '../mocks/worklog-response.json';
import workLogs from '../mocks/workLogs';

describe('parseWorkLogsFrom', () => {
  it('should parse response into WorkLogs[]', async () => {
    const parsed = parseWorkLogsFrom(response);

    expect(parsed).toStrictEqual(workLogs);
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
