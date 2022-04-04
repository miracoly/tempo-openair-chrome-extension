import { DayReport } from '../tempo/tempo';
import dayjs from 'dayjs';

const fullWorkLogDayReport: DayReport[] = [
  {
    day: dayjs('2022-03-22'),
    totalTimeSpendSeconds: 900 + 1800 + 7200 + 7200 + 1800,
    descriptions: [
      'Daily',
      'Live Deployments Discussion',
      '#116533: CC: Critical Vulnerability found in Tisax Nightly for netty:netty 2.0.48',
      'UX / UI / FE Sync',
    ],
  },
  {
    day: dayjs('2022-03-23'),
    totalTimeSpendSeconds: 1800 + 8100 + 5400 + 7200,
    descriptions: [
      'Daily',
      '#115546: CC: Refactor Date usages to LocalDate or LocalDateTime',
      '#114993: CC: Do Prelive Deployment according to documentation & improve documentation',
    ],
  },
  {
    day: dayjs('2022-03-24'),
    totalTimeSpendSeconds: 900 + 1800 + 3600 + 6300 + 5400,
    descriptions: [
      'Daily',
      '#96207: CC: Persist and Show in FE sales data from arvato',
      '#114993: CC: Do Prelive Deployment according to documentation & improve documentation',
      'CC1 Sprint Review',
      '#115546: CC: Refactor Date usages to LocalDate or LocalDateTime',
    ],
  },
  {
    day: dayjs('2022-03-25'),
    totalTimeSpendSeconds: 2700 + 900 + 3600 + 3600 + 3600 + 10800,
    descriptions: [
      'ABCD Dev Sync',
      'Daily',
      'CC1 Retrospektive',
      'CC1 Refinement & Planning',
      '#115546: CC: Refactor Date usages to LocalDate or LocalDateTime',
    ],
  },
];

export default fullWorkLogDayReport;
