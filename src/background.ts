import { parseBoundaries, tabContains, TIMESHEET_TITLE, TIMESHEET_URL } from './openAir/openAir';
import { Message, MessageType } from './messages';
import { getDayReportsFromTempo } from './tempo/tempo';
import { newDayRange } from './utils/utils';
import Tab = chrome.tabs.Tab;
import MessageSender = chrome.runtime.MessageSender;
import { DayReport } from './tempo/types';

export const BACKEND_CONTENT_PORT_NAME = 'backend-to-content';

chrome.runtime.onMessage.addListener(
  (request: Message, _: MessageSender, sendResponse: (response: Message) => void) => {
    if (request.type === MessageType.BUTTON_CLICK) {
      chrome.tabs.query({ active: true, currentWindow: true }, handleButtonClick(sendResponse));
    }
    return true;
  }
);

function handleButtonClick(sendResponse: (response: Message) => void) {
  return (tab: Tab[]): void => {
    const activeTab = tab[0];
    if (activeTab.id && tabContains(TIMESHEET_URL, TIMESHEET_TITLE)(activeTab)) {
      fillInReport(activeTab.id, sendResponse);
    } else {
      sendResponse({ type: MessageType.FAILURE });
    }
  };
}

function fillInReport(tabId: number, sendResponse: (response: Message) => void): void {
  const portToContent = chrome.tabs.connect(tabId, { name: BACKEND_CONTENT_PORT_NAME });
  portToContent.postMessage({ type: MessageType.REQUEST_DATE_RANGE } as Message);

  portToContent.onMessage.addListener(async (message: Message, port) => {
    switch (message.type) {
      case MessageType.RESPOND_DATE_RANGE:
        const reports = await getReports(message);
        port.postMessage({ type: MessageType.FILL_IN_REPORT, payload: reports } as Message);
        break;
      case MessageType.SUCCESS:
        sendResponse(message);
        port.disconnect();
        break;
      default:
        sendResponse({ type: MessageType.FAILURE });
        port.disconnect();
        break;
    }
  });
}

function getReports(message: Message): Promise<DayReport[]> {
  const { from, to } = parseBoundaries(message.payload as string);
  return getDayReportsFromTempo(288, newDayRange(from, to));
}
