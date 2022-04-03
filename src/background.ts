type Message = {
  event: string;
};

chrome.runtime.onMessage.addListener(listenOnMessage);

function listenOnMessage(message: Message) {
  console.log('inside background.ts, event: ', message.event);
  return true; // Inform Chrome that we will make a delayed sendResponse
}

export { Message };
