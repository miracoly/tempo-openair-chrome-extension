import { Message, MessageType } from './messages';
import { LocalStorage } from './background';
import 'flowbite';

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
  setIsLoading();
  chrome.runtime.sendMessage({ type: MessageType.FILL_TIMESHEET } as Message, handleResponse);
}

function handleResponse(response: Message): void {
  unsetIsLoading();
  chrome.notifications.create('fill-timesheet', {
    title: 'Tempo to OpenAir',
    type: 'basic',
    message: MessageType[response.type],
    iconUrl: '/images/logo128.png',
  });
}

function queryConfigInputs(): [string, HTMLInputElement][] {
  return Object.entries({
    issueKey: document.querySelector('input#tempo-issue-key') as HTMLInputElement,
    tempoApiToken: document.querySelector('input#tempo-api-token') as HTMLInputElement,
  });
}

function setIsLoading() {
  document.querySelector('button#fill-timesheet')?.classList.add('hidden');
  document.querySelector('#loading-spinner')?.classList.remove('hidden');
}

function unsetIsLoading() {
  document.querySelector('button#fill-timesheet')?.classList.remove('hidden');
  document.querySelector('#loading-spinner')?.classList.add('hidden');
}
