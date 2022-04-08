import { Message, MessageType } from './messages';
import { LocalStorage } from './background';

document
  .querySelector('button#save-issue-key')
  ?.addEventListener('click', updateStorageWith(queryConfigInputs));

function updateStorageWith(queryInputs: () => [string, string][]) {
  return (): void => {
    const keyValues = queryInputs();
    const keysToRemove = keyValues.filter(keyValue => !keyValue[1]).map(keyValue => keyValue[0]);
    const keysToSave = keyValues.filter(keyValue => keyValue[1]);

    chrome.storage.sync.remove(keysToRemove);
    chrome.storage.sync.set(Object.fromEntries(keysToSave));
  };
}

function queryConfigInputs() {
  return Object.entries({
    issueKey: (document.querySelector('input#tempo-issue-key') as HTMLInputElement).value,
    tempoApiToken: (document.querySelector('input#tempo-api-token') as HTMLInputElement).value,
  });
}

chrome.storage.sync.get(['issueKey', 'tempoApiToken'], (storage: LocalStorage) => {
  const input = document.querySelector('input#tempo-issue-key') as HTMLInputElement;
  const tempoApiToken = document.querySelector('input#tempo-api-token') as HTMLInputElement;
  if (input && tempoApiToken && storage.tempoApiToken && storage.issueKey) {
    input.value = storage.issueKey;
    tempoApiToken.value = storage.tempoApiToken;
  }
});

document.querySelector('button#fill-timesheet')?.addEventListener('click', () => {
  chrome.runtime.sendMessage(
    { type: MessageType.FILL_TIMESHEET } as Message,
    (response: Message): void => console.log(`Response was ${MessageType[response.type]}`)
  );
});
