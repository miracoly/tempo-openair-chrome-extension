import { fetchWorkLogs } from './tempo';
import dayjs from 'dayjs';

it('should test getWorkLogs', function () {
  const workLogs = fetchWorkLogs(254, dayjs("2022-03-21"), dayjs("2022-03-27"));
  expect(workLogs).toBe([]);
});