import { Message } from './background';

const button = document.getElementById('button');

if (button) {
  button.addEventListener('click', function () {
    chrome.runtime.sendMessage({ event: 'button-click' } as Message);
  });
}
