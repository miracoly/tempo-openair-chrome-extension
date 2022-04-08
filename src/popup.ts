import { Message, MessageType } from './messages';
import { LocalStorage } from './background';

Array.from(document.querySelectorAll('input')).forEach(input =>
  input.addEventListener('blur', updateStorageWith(queryConfigInputs))
);

document.querySelector('button#fill-timesheet')?.addEventListener('click', fillTimeSheet);

chrome.storage.sync.get(['issueKey', 'tempoApiToken'], (storage: LocalStorage): void => {
  queryConfigInputs()
    .filter(keyValue => storage[keyValue[0]])
    .forEach(keyValue => (keyValue[1].value = storage[keyValue[0]]));
});

function updateStorageWith(queryInputs: () => [string, HTMLInputElement][]) {
  return (): void => {
    const keyValues = queryInputs().map(keyValue => [keyValue[0], keyValue[1].value]);
    const keysToRemove = keyValues.filter(keyValue => !keyValue[1]).map(keyValue => keyValue[0]);
    const keysToSave = keyValues.filter(keyValue => keyValue[1]);

    chrome.storage.sync.remove(keysToRemove);
    chrome.storage.sync.set(Object.fromEntries(keysToSave));
  };
}

function fillTimeSheet(): void {
  chrome.runtime.sendMessage(
    { type: MessageType.FILL_TIMESHEET } as Message,
    (response: Message): void => console.log(`Response was ${MessageType[response.type]}`)
  );
}

function queryConfigInputs(): [string, HTMLInputElement][] {
  return Object.entries({
    issueKey: document.querySelector('input#tempo-issue-key') as HTMLInputElement,
    tempoApiToken: document.querySelector('input#tempo-api-token') as HTMLInputElement,
  });
}
