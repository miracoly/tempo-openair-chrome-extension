import { Message, MessageType } from './messages';
import { LocalStorage } from './background';

document.querySelector('button#save-issue-key')?.addEventListener('click', () => {
  const issueKey = (document.querySelector('input#tempo-issue-key') as HTMLInputElement).value;
  chrome.storage.sync.set({ issueKey });
});

chrome.storage.sync.get(['issueKey'], (result: LocalStorage) => {
  const input = document.querySelector('input#tempo-issue-key') as HTMLInputElement;
  if (input) {
    input.value = result.issueKey;
  }
});

document.querySelector('button#fill-timesheet')?.addEventListener('click', () => {
  chrome.runtime.sendMessage(
    { type: MessageType.BUTTON_CLICK } as Message,
    (response: Message): void => {
      switch (response.type) {
        case MessageType.SUCCESS:
          console.log('Response was SUCCESS');
          break;
        case MessageType.FAILURE:
          console.log('Response was FAILURE');
          break;
        default:
          console.log('unknown response');
      }
    }
  );
});
