
import { Request, Response } from './messages';

document.getElementById('button')?.addEventListener('click', function () {
  chrome.runtime.sendMessage(Request.BUTTON_CLICK, (response: Response) => {
    switch (response) {
      case Response.SUCCESS:
        console.log('Response was SUCCESS');
        break;
      case Response.NOT_ON_OPENAIR_TIMESHEET_SITE:
        console.log('Response was NOT_ON_OPENAIR_TIMESHEET_SITE');
        break;
      default:
        console.log('unknown response');
    }
  });
});
