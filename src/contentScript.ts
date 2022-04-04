import { Request } from './messages';
import { DATE_RANGE_SELECTOR } from './openAir/openAir';

chrome.runtime.onMessage.addListener((message: Request, _, sendResponse) => {
  if (message === Request.REQUEST_DATES) {
    const dateText = (document.querySelector(DATE_RANGE_SELECTOR) as HTMLSpanElement).textContent;
    console.log(dateText);
    sendResponse({ farewell: 'response from contentScript' });
  }
});