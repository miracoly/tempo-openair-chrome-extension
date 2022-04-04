import dayjs from 'dayjs';
import Tab = chrome.tabs.Tab;

enum Message {
  BUTTON_CLICK,
  REQUEST_DATES,
}

const OPENAIR_TIMESHEET_URL = /https:\/\/.*\.app\.openair\.com\/timesheet.*uid=.*timesheet_id=\d*/;
const OPENAIR_TIMESHEET_TITLE = /OpenAir\s:\sTimesheets\s:\s.*/;

chrome.runtime.onMessage.addListener((message: Message) => {
  switch (message) {
    case Message.BUTTON_CLICK:
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabContains(OPENAIR_TIMESHEET_URL, OPENAIR_TIMESHEET_TITLE)(tabs[0])) {
          console.log('not on Timesheet site');
          return false;
        }
        console.log('on Timesheet site');
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, Message.REQUEST_DATES, response => {
            console.log(response.farewell);
          });
        }
      });

      fillTempoToOpenAir();
      break;
    default:
      return false;
  }

  return true;
});

function tabContains(url: RegExp, title: RegExp) {
  return (tab: Tab): boolean =>
    !!tab.url && !!tab.title && url.test(tab.url) && title.test(tab.title);
}

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
  // const dayReports = await getDayReportsFromTempo(254, week);
  // console.log('dayReports', dayReports);
}

export { Message };
