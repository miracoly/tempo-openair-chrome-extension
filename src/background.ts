import { getWorkLogReportOf } from './tempo/tempo';
import dayjs from 'dayjs';

enum Message {
  BUTTON_CLICK,
}

chrome.runtime.onMessage.addListener((message: Message) => {
  switch (message) {
    case Message.BUTTON_CLICK:
      fillTempoToOpenAir();
      break;
    default:
      return false;
  }

  return true;
});

async function fillTempoToOpenAir() {
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
