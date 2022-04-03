import dayjs from 'dayjs';
import { WorkLog } from '../tempo/types';

const workLogsOneDay: WorkLog[] = [
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 900,
    startDate: dayjs('2022-03-22T09:15:00'),
    description: 'Live Deployments Discussion',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 1800,
    startDate: dayjs('2022-03-22T09:30:00'),
    description: 'Live Deployments Discussion',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 7200,
    startDate: dayjs('2022-03-22T10:00:00'),
    description:
      '#116533: CC: Critical Vulnerability found in Tisax Nightly for netty:netty 2.0.48',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 7200,
    startDate: dayjs('2022-03-22T14:00:00'),
    description:
      '#116533: CC: Critical Vulnerability found in Tisax Nightly for netty:netty 2.0.48',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 1800,
    startDate: dayjs('2022-03-22T16:00:00'),
    description: 'UX / UI / FE Sync',
  },
];

export default workLogsOneDay;
