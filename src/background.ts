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
  [keys in 'issueKey' | 'tempoApiToken' | string]: any;
};

chrome.runtime.onMessage.addListener(
  (request: Message, _: MessageSender, sendResponse: (response: Message) => void) => {
    if (request.type === MessageType.FILL_TIMESHEET) {
      chrome.tabs.query({ active: true, currentWindow: true }, fillTimesheet(sendResponse));
    }
    return true;
  }
);

function useStorageWith(
  keys: string[],
  callback: (storage: LocalStorage) => void,
  handleNotFound: (nonExistingKeys: string[]) => void
): void {
  chrome.storage.sync.get(['issueKey', 'tempoApiToken'], (storage: LocalStorage) => {
    console.log('storage inside useStorageWith', storage);
    const nonExistingKeys = keys.filter(key => !storage[key]);
    console.log('nonExistingKeys', nonExistingKeys);
    if (nonExistingKeys.length === 0) {
      callback(storage);
    } else {
      handleNotFound(nonExistingKeys);
    }
  });
}

function fillTimesheet(sendResponse: (response: Message) => void) {
  return (tabs: Tab[]): void => {
    const activeTab = tabs[0];
    if (tabContains(TIMESHEET_URL, TIMESHEET_TITLE)(activeTab) && activeTab.id) {
      const portToContent = chrome.tabs.connect(activeTab.id, { name: BACKEND_CONTENT_PORT_NAME });
      portToContent.onMessage.addListener(listenToContent(sendResponse));
      portToContent.postMessage({ type: MessageType.REQUEST_DATE_RANGE } as Message);
    } else {
      sendResponse({ type: MessageType.NOT_ON_OPENAIR_TIMESHEET_SITE });
    }
  };
}

function listenToContent(sendResponse: (response: Message) => void) {
  return (message: Message, port: Port): void => {
    switch (message.type) {
      case MessageType.RESPOND_DATE_RANGE:
        useStorageWith(
          ['issueKey', 'tempoApiToken'],
          getAndSendDayReports(message.payload, port, handleFetchError(sendResponse)),
          handleKeysNotFound(sendResponse)
        );
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

function handleKeysNotFound(sendResponse: (response: Message) => void) {
  return (nonExistingKeys: string[]): void => {
    console.log('inside handleKeysNotFound');
    sendResponse({
      type: MessageType.STORAGE_KEYS_NOT_FOUND,
      payload: { nonExistingKeys },
    });
  };
}

function getAndSendDayReports(
  dateText: string,
  port: Port,
  handleError?: (reason: any) => void
) {
  return (storage: LocalStorage): void => {
    const { from, to } = parseBoundaries(dateText);
    const filter: WorkLogFilter = {
      issueKey: storage.issueKey,
      from,
      to,
    };
    console.log('inside getAndSendDayReports', storage.tempoApiToken);
    fetchDayReports(
      newDayRange(from, to),
      {filter, token: storage.tempoApiToken},
      sendDayReportsTo(port),
      handleError
    );
  };
}

function sendDayReportsTo(port: Port) {
  return (reports: DayReport[]): void => {
    port.postMessage({ type: MessageType.FILL_IN_REPORT, payload: reports });
  };
}

function handleFetchError(sendResonse: (response: Message) => void) {
  return (reason: any): void => {
    sendResonse({ type: MessageType.COULD_NOT_FETCH_TEMPO_API, payload: reason });
  };
}
