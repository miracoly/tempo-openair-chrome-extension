import { Message, MessageType } from './messages';
import { DATE_RANGE_SELECTOR, TABLE_CELLS_SELECTOR } from './openAir/openAir';
import { BACKEND_CONTENT_PORT_NAME } from './background';
import { DayReport } from './tempo/types';
import dayjs, { Dayjs } from 'dayjs';
import Port = chrome.runtime.Port;

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

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

type CellWithDate = {
  cell: HTMLTableCellElement;
  day?: Dayjs;
};

function handleFillInReport(message: Message) {
  const dayReports: DayReport[] = (message.payload as DayReport[]).map(report => ({
    ...report,
    day: dayjs(report.day),
  }));
  const cells: HTMLTableCellElement[] = Array.from(document.querySelectorAll(TABLE_CELLS_SELECTOR));
  const cellsWithDay = cells.map(toTableCellWithDay).filter(cell => cell.day);

  cellsWithDay.forEach(fillInTotalTimeSpendHours(dayReports));
}

function toTableCellWithDay(cell: HTMLTableCellElement): CellWithDate {
  const dateText = cell.querySelector('a')?.getAttribute('data-additional-title');
  const day = dateText ? dayjs(dateText.split(' ')[1], 'DD-MM-YY') : undefined;
  return { day, cell };
}

function fillInTotalTimeSpendHours(dayReports: DayReport[]) {
  return (cell: CellWithDate) => {
    const dayReport = dayReports.find(report => report.day.isSame(cell.day, 'date'));
    const input = cell.cell.querySelector('input');
    if (input && dayReport) {
      input.value = dayReport.totalTimeSpendSeconds.toString();
    }
  };
}
