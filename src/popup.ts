import { Message } from './background';

document.getElementById('button')?.addEventListener('click', function () {
  chrome.runtime.sendMessage(Message.BUTTON_CLICK);
});
