import { fetchWorkLogs } from './tempo/tempo';
import dayjs from 'dayjs';

type Message = {
  event: string;
};

chrome.runtime.onMessage.addListener(listenOnMessage);

function listenOnMessage(message: Message) {
  fetchWorkLogs(254, dayjs("2022-03-21"), dayjs("2022-03-27"))
  return true; // Inform Chrome that we will make a delayed sendResponse
}

export { Message };
