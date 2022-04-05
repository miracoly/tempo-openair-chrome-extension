import { parse, tabContains, TIMESHEET_TITLE, TIMESHEET_URL } from './openAir/openAir';
import { Message, MessageType } from './messages';
import { getDayReportsFromTempo } from './tempo/tempo';
import { newDayRange } from './utils/utils';

export const CONTENT_SCRIPT_PORT_NAME = 'tempo-to-openair';

chrome.runtime.onMessage.addListener(
  (request: Message, _, sendResponse: (response: Message) => void) => {
    if (request.type === MessageType.BUTTON_CLICK) {
      handleButtonClick(sendResponse);
      return true;
    }

    return false;
  }
);

async function handleButtonClick(sendResponse: (response: Message) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (!tabContains(TIMESHEET_URL, TIMESHEET_TITLE)(tabs[0])) {
      sendResponse({ type: MessageType.NOT_ON_OPENAIR_TIMESHEET_SITE });
    }

    if (tabs[0].id) {
      const port = chrome.tabs.connect(tabs[0].id, { name: CONTENT_SCRIPT_PORT_NAME });
      port.postMessage({ type: MessageType.REQUEST_DATE_RANGE } as Message);

      port.onMessage.addListener(async (message: Message) => {
        if (message.type === MessageType.SUCCESS) {
          const { from, to } = parse(message.payload as string);
          const days = newDayRange(from, to);
          const dayReports = await getDayReportsFromTempo(254, days);
          console.log('dayReports', dayReports);
        }
      });
    }
  });
}
