import { addParamsTo } from './utils';

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
