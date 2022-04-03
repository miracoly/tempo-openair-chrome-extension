import dayjs from 'dayjs';
import { WorkLog } from '../tempo/types';

const workLogsAccumulated: WorkLog[] = [
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 900 + 1800 + 900 + 900,
    startDate: dayjs('2022-03-22T09:15:00'),
    description: 'Daily',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 1800,
    startDate: dayjs('2022-03-22T09:30:00'),
    description: 'Live Deployments Discussion',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 14400,
    startDate: dayjs('2022-03-22T10:00:00'),
    description:
      '#116533: CC: Critical Vulnerability found in Tisax Nightly for netty:netty 2.0.48',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 1800,
    startDate: dayjs('2022-03-22T16:00:00'),
    description: 'UX / UI / FE Sync',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 13500 + 5400 + 10800,
    startDate: dayjs('2022-03-23T09:45:00'),
    description: '#115546: CC: Refactor Date usages to LocalDate or LocalDateTime',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 7200 + 3600,
    startDate: dayjs('2022-03-23T15:00:00'),
    description:
      '#114993: CC: Do Prelive Deployment according to documentation & improve documentation',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 1800,
    startDate: dayjs('2022-03-24T09:30:00'),
    description: '#96207: CC: Persist and Show in FE sales data from arvato',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 6300,
    startDate: dayjs('2022-03-24T14:00:00'),
    description: 'CC1 Sprint Review',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 2700,
    startDate: dayjs('2022-03-25T08:00:00'),
    description: 'ABCD Dev Sync',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 3600,
    startDate: dayjs('2022-03-25T09:30:00'),
    description: 'CC1 Retrospektive',
  },
  {
    issueKey: 'TIME-254',
    timeSpentSeconds: 7200,
    startDate: dayjs('2022-03-25T10:30:00'),
    description: 'CC1 Refinement & Planning',
  },
];

export default workLogsAccumulated;
