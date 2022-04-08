import { Message, MessageType } from './messages';
import { LocalStorage } from './background';

document.querySelector('button#save-issue-key')?.addEventListener('click', () => {
  const issueKeyText = (document.querySelector('input#tempo-issue-key') as HTMLInputElement).value;
  const issueKey = issueKeyText === '' ? undefined : parseInt(issueKeyText);
  chrome.storage.sync.set({ 'issueKey': issueKey });
});

chrome.storage.sync.get(['issueKey'], (result: LocalStorage) => {
  const input = document.querySelector('input#tempo-issue-key') as HTMLInputElement;
  if (input) {
    input.value = result.issueKey;
  }
});

document.querySelector('button#fill-timesheet')?.addEventListener('click', () => {
  chrome.runtime.sendMessage(
    { type: MessageType.FILL_TIMESHEET } as Message,
    (response: Message): void => console.log(`Response was ${MessageType[response.type]}`)
  );
});
