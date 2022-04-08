import { parseBoundaries, tabContains, TIMESHEET_TITLE, TIMESHEET_URL } from './openAir/openAir';
import { Message, MessageType } from './messages';
import { fetchDayReports, WorkLogFilter } from './tempo/tempo';
import { newDayRange } from './utils/utils';
import { DayReport } from './tempo/types';
import Tab = chrome.tabs.Tab;
import MessageSender = chrome.runtime.MessageSender;
import Port = chrome.runtime.Port;

export const BACKEND_CONTENT_PORT_NAME = 'backend-to-content';

export type LocalStorage = {
  [keys in 'issueKey' | string]: any;
};

chrome.runtime.onMessage.addListener(
  (request: Message, _: MessageSender, sendResponse: (response: Message) => void) => {
    if (request.type === MessageType.FILL_TIMESHEET) {
      chrome.tabs.query({ active: true, currentWindow: true }, fillTimesheet(sendResponse));
    }
    return true;
  }
);

function useStorageWith(callback: (storage: LocalStorage) => void) {
  chrome.storage.sync.get(['issueKey'], callback);
}

function fillTimesheet(sendResponse: (response: Message) => void) {
  return (tabs: Tab[]) => {
    const activeTab = tabs[0];
    console.log('tabContains', tabContains(TIMESHEET_URL, TIMESHEET_TITLE)(activeTab));
    console.log('activeTab.id', activeTab.id);
    if (tabContains(TIMESHEET_URL, TIMESHEET_TITLE)(activeTab) && activeTab.id) {
      console.log('On OpenAir site');
      const portToContent = chrome.tabs.connect(activeTab.id, { name: BACKEND_CONTENT_PORT_NAME });
      portToContent.onMessage.addListener(listenToContent(sendResponse));
      portToContent.postMessage({ type: MessageType.REQUEST_DATE_RANGE } as Message);
    } else {
      sendResponse({ type: MessageType.NOT_ON_OPENAIR_TIMESHEET_SITE });
    }
  };
}

function listenToContent(sendResponse: (response: Message) => void) {
  return (message: Message, port: Port) => {
    console.log(`${MessageType[message.type]} received in background`);
    switch (message.type) {
      case MessageType.RESPOND_DATE_RANGE:
        console.log('dateText', message.payload);
        useStorageWith(getAndSendDayReports(message.payload, port));
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
  };
}

function getAndSendDayReports(dateText: string, port: Port) {
  return (storage: LocalStorage): void => {
    const { from, to } = parseBoundaries(dateText);
    const days = newDayRange(from, to);
    const filter: WorkLogFilter = {
      issueKey: storage.issueKey,
      from,
      to,
    };
    fetchDayReports(days, filter, sendDayReportsTo(port));
  };
}

function sendDayReportsTo(port: Port) {
  return (reports: DayReport[]) => {
    port.postMessage({ type: MessageType.FILL_IN_REPORT, payload: reports });
  };
}
