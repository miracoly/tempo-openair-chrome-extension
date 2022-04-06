import { Message, MessageType } from './messages';

document.getElementById('button')?.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: MessageType.BUTTON_CLICK } as Message, (response: Message): void => {
    switch (response.type) {
      case MessageType.SUCCESS:
        console.log('Response was SUCCESS');
        break;
      case MessageType.NOT_ON_OPENAIR_TIMESHEET_SITE:
        console.log('Response was NOT_ON_OPENAIR_TIMESHEET_SITE');
        break;
      default:
        console.log('unknown response');
    }
  });
});
