import { Message } from './background';

chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
  if (message === Message.REQUEST_DATES) {
    console.log('Message received in Content script');
    sendResponse({ farewell: 'response from contentScript' });
  }
});
