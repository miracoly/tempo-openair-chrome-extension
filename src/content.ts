import { Message, MessageType } from './messages';
import { CellWithDate, DATE_RANGE_SELECTOR, TABLE_CELLS_SELECTOR, toTableCellWithDay, } from './openAir/openAir';
import { BACKEND_CONTENT_PORT_NAME } from './background';
import { DayReport } from './tempo/types';
import dayjs from 'dayjs';
import { toHourString } from './utils/utils';
import Port = chrome.runtime.Port;

chrome.runtime.onConnect.addListener(portToBackend => {
  console.assert(portToBackend.name === BACKEND_CONTENT_PORT_NAME);

  portToBackend.onMessage.addListener((message: Message, port) => {
    if (message.type === MessageType.REQUEST_DATE_RANGE) {
      handleRequestDateRange(port);
    }
    if (message.type === MessageType.FILL_IN_REPORT) {
      handleFillInReport(message, port);
    }
  });
});

function handleRequestDateRange(port: Port) {
  const dateText = (document.querySelector(DATE_RANGE_SELECTOR) as HTMLSpanElement).textContent;
  const response: Message = dateText
    ? { payload: dateText, type: MessageType.RESPOND_DATE_RANGE }
    : { type: MessageType.DATE_RANGE_NOT_FOUND };

  port.postMessage(response);
}

function handleFillInReport(message: Message, port: Port) {
  const dayReports: DayReport[] = (message.payload as DayReport[]).map(report => ({
    ...report,
    day: dayjs(report.day),
  }));
  const cells: HTMLTableCellElement[] = Array.from(document.querySelectorAll(TABLE_CELLS_SELECTOR));
  const cellsWithDay = cells.map(toTableCellWithDay).filter(cell => cell.day);

  cellsWithDay.forEach(fillInTotalTimeSpendHours(dayReports));

  port.postMessage({ type: MessageType.SUCCESS });
}

function fillInTotalTimeSpendHours(dayReports: DayReport[]) {
  return (cell: CellWithDate) => {
    const dayReport = dayReports.find(report => report.day.isSame(cell.day, 'date'));
    const input = cell.cell.querySelector('input');
    const a = cell.cell.querySelector('a');
    if (input && a && dayReport) {
      input.value = toHourString(dayReport.totalTimeSpendSeconds);
      a.click();
      const descriptionPopup = document.querySelector('body > div.dialogBlock.dialogBlock1Column.fade.ui-draggable');
      if (descriptionPopup) {
        const textArea: HTMLTextAreaElement = descriptionPopup.querySelector('textarea#tm_notes') as HTMLTextAreaElement;
        textArea.value = dayReport.descriptions.join('\n\n');
        const okButton = Array.from(descriptionPopup.querySelectorAll('button'))
          .find(button => button.textContent === 'OK') as HTMLButtonElement;
        okButton.click();
      }
    }
  };
}
