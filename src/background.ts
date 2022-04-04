import { TIMESHEET_TITLE, TIMESHEET_URL, tabContains } from './openAir/openAir';
import { Request, Response } from './messages';

chrome.runtime.onMessage.addListener(
  (request: Request, _, sendResponse: (response: Response) => void) => {
    switch (request) {
      case Request.BUTTON_CLICK:
        fillTempoToOpenAir(sendResponse);
        break;
      default:
        return false;
    }

    return true;
  }
);

async function fillTempoToOpenAir(sendResponse: (response: Response) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (!tabContains(TIMESHEET_URL, TIMESHEET_TITLE)(tabs[0])) {
      sendResponse(Response.NOT_ON_OPENAIR_TIMESHEET_SITE);
    }

    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, Request.REQUEST_DATES, response => {
        console.log(response.farewell);
      });
    }
  });
}