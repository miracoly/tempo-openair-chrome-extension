import { Message, MessageType } from './messages';
import { CellWithDate, DATE_RANGE_SELECTOR, TABLE_CELLS_SELECTOR, toTableCellWithDay } from './openAir/openAir';
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
      handleFillInReport(message);
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

function handleFillInReport(message: Message) {
  const dayReports: DayReport[] = (message.payload as DayReport[]).map(report => ({
    ...report,
    day: dayjs(report.day),
  }));
  const cells: HTMLTableCellElement[] = Array.from(document.querySelectorAll(TABLE_CELLS_SELECTOR));
  const cellsWithDay = cells.map(toTableCellWithDay).filter(cell => cell.day);

  cellsWithDay.forEach(fillInTotalTimeSpendHours(dayReports));
}

function fillInTotalTimeSpendHours(dayReports: DayReport[]) {
  return (cell: CellWithDate) => {
    const dayReport = dayReports.find(report => report.day.isSame(cell.day, 'date'));
    const input = cell.cell.querySelector('input');
    if (input && dayReport) {
      input.value = toHourString(dayReport.totalTimeSpendSeconds);
    }
  };
}
