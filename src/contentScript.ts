import { Message, MessageType } from './messages';
import { DATE_RANGE_SELECTOR } from './openAir/openAir';
import { CONTENT_SCRIPT_PORT_NAME } from './background';

chrome.runtime.onConnect.addListener(port => {
  console.assert(port.name === CONTENT_SCRIPT_PORT_NAME);

  port.onMessage.addListener((message: Message) => {
    if (message.type === MessageType.REQUEST_DATE_RANGE) {
      const dateText = (document.querySelector(DATE_RANGE_SELECTOR) as HTMLSpanElement).textContent;

      const response: Message = dateText
        ? { payload: dateText, type: MessageType.SUCCESS }
        : { type: MessageType.DATE_RANGE_NOT_FOUND };

      port.postMessage(response);
    }
  });
});