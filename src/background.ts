import { parseBoundaries, tabContains, TIMESHEET_TITLE, TIMESHEET_URL } from './openAir/openAir';
import { Message, MessageType } from './messages';
import { getDayReportsFromTempo } from './tempo/tempo';
import { newDayRange } from './utils/utils';
import { DayReport } from './tempo/types';
import Tab = chrome.tabs.Tab;
import MessageSender = chrome.runtime.MessageSender;

export const BACKEND_CONTENT_PORT_NAME = 'backend-to-content';

export type LocalStorage = {
  [keys in 'issueKey' | string]: any;
};

chrome.runtime.onMessage.addListener(
  (request: Message, _: MessageSender, sendResponse: (response: Message) => void) => {
    if (request.type === MessageType.BUTTON_CLICK) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        useStorageOnTabWith(handleButtonClick(sendResponse))
      );
    }
    return true;
  }
);

function useStorageOnTabWith(callback: (tab: Tab[]) => any) {
  return (tab: Tab[]) => {
    chrome.storage.sync.get(['issueKey'], callback(tab));
  };
}

function handleButtonClick(sendResponse: (response: Message) => void) {
  return (tab: Tab[]) =>
    (storage: LocalStorage): void => {
      const activeTab = tab[0];
      if (!storage.issueKey) {
        sendResponse({ type: MessageType.ISSUE_KEY_NOT_SET });
      } else if (!tabContains(TIMESHEET_URL, TIMESHEET_TITLE)(activeTab)) {
        sendResponse({ type: MessageType.NOT_ON_OPENAIR_TIMESHEET_SITE });
      } else if (activeTab.id) {
        fillInReport(activeTab.id, storage.issueKey, sendResponse);
      } else {
        sendResponse({ type: MessageType.UNEXPECTED_FAILURE });
      }
    };
}

function fillInReport(tabId: number, issueKey: number, sendResponse: (response: Message) => void) {
  const portToContent = chrome.tabs.connect(tabId, { name: BACKEND_CONTENT_PORT_NAME });
  portToContent.postMessage({ type: MessageType.REQUEST_DATE_RANGE } as Message);

  portToContent.onMessage.addListener(async (message: Message, port) => {
    switch (message.type) {
      case MessageType.RESPOND_DATE_RANGE:
        const reports = await getReports(issueKey, message.payload as string);
        port.postMessage({ type: MessageType.FILL_IN_REPORT, payload: reports } as Message);
        break;
      case MessageType.SUCCESS:
        sendResponse(message);
        port.disconnect();
        break;
      default:
        sendResponse({ type: MessageType.UNEXPECTED_FAILURE });
        port.disconnect();
        break;
    }
  });
}

function getReports(issueKey: number, dateText: string): Promise<DayReport[]> {
  const { from, to } = parseBoundaries(dateText);
  return getDayReportsFromTempo(issueKey, newDayRange(from, to));
}
