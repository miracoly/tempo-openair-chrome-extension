import { parseBoundaries, tabContains, TIMESHEET_TITLE, TIMESHEET_URL } from './openAir/openAir';
import { Message, MessageType } from './messages';
import { getDayReportsFromTempo } from './tempo/tempo';
import { newDayRange } from './utils/utils';
import Tab = chrome.tabs.Tab;
import MessageSender = chrome.runtime.MessageSender;

export const CONTENT_SCRIPT_PORT_NAME = 'tempo-to-openair';

chrome.runtime.onMessage.addListener(handleRequest);

function handleRequest(request: Message, _: MessageSender, sendResponse: (response: Message) => void) {
  if (request.type === MessageType.BUTTON_CLICK) {
    chrome.tabs.query({ active: true, currentWindow: true }, handleButtonClick(sendResponse));
  }
}

function handleButtonClick(sendResponse: (response: Message) => void) {
  return (tab: Tab[]): void => {
    const activeTab = tab[0];
    if (!tabContains(TIMESHEET_URL, TIMESHEET_TITLE)(activeTab)) {
      sendResponse({ type: MessageType.NOT_ON_OPENAIR_TIMESHEET_SITE });
    }
    fillInReport(activeTab, sendResponse);
  };
}

function fillInReport(tab: Tab, sendResponse: (response: Message) => void): void {
  if (!tab.id) {
    sendResponse({ type: MessageType.UNEXPECTED_FAILURE})
    return;
  }

  const port = chrome.tabs.connect(tab.id, { name: CONTENT_SCRIPT_PORT_NAME });
  port.postMessage({ type: MessageType.REQUEST_DATE_RANGE } as Message);

  port.onMessage.addListener(async (message: Message) => {
    if (message.type === MessageType.RESPOND_DATE_RANGE) {
      const reports = await getReports(message);
      port.postMessage({ type: MessageType.FILL_IN_REPORT, payload: reports } as Message);
    }
  });
}

function getReports(message: Message) {
  const { from, to } = parseBoundaries(message.payload as string);
  const days = newDayRange(from, to);
  return getDayReportsFromTempo(288, days);
}
