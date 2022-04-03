import { parseWorkLogsFrom } from './tempo';
import response from '../mocks/worklog-response.json';

describe('parseWorkLogsFrom', () => {
  it('should parse response into WorkLogs[]', async () => {
    const workLogs = parseWorkLogsFrom(response);

    expect(workLogs).toBe(response);
  });
});
