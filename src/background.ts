import { getWorkLogReportOf } from './tempo/tempo';
import dayjs from 'dayjs';

type Message = {
  event: string;
};

chrome.runtime.onMessage.addListener(message => {
  listenOnMessage(message);
  return true;
});

async function listenOnMessage(message: Message) {
  const week = [
    dayjs('2022-03-21'),
    dayjs('2022-03-22'),
    dayjs('2022-03-23'),
    dayjs('2022-03-24'),
    dayjs('2022-03-25'),
    dayjs('2022-03-26'),
    dayjs('2022-03-27'),
  ];
  await getWorkLogReportOf(254, week);
}

export { Message };
