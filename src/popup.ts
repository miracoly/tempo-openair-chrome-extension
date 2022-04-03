import { Message } from './background';

document.getElementById('button')?.addEventListener('click', function () {
  chrome.runtime.sendMessage({ event: 'button-click' } as Message);
});
