import { Message, MessageType } from './messages';
import { DATE_RANGE_SELECTOR, TABLE_CELLS_SELECTOR } from './openAir/openAir';
import { CONTENT_SCRIPT_PORT_NAME } from './background';
import { DayReport } from './tempo/types';
import dayjs, { Dayjs } from 'dayjs';
import Port = chrome.runtime.Port;

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

chrome.runtime.onConnect.addListener(port => {
  console.assert(port.name === CONTENT_SCRIPT_PORT_NAME);

  port.onMessage.addListener((message: Message) => {
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

function toTableCellWithDay(cell: HTMLTableCellElement): {
  cell: HTMLTableCellElement;
  day?: Dayjs;
} {
  const dateText = cell.querySelector('a')?.getAttribute('data-additional-title');
  const day = dateText ? dayjs(dateText.split(' ')[1], 'DD-MM-YY') : undefined;
  return { day, cell };
}

function handleFillInReport(message: Message) {
  const dayReports: DayReport[] = message.payload;
  dayReports.forEach(report => report.day = dayjs(report.day));
  const cells: HTMLTableCellElement[] = Array.from(document.querySelectorAll(TABLE_CELLS_SELECTOR));
  const cellsWithDay = cells.map(toTableCellWithDay).filter(cell => cell.day);
  console.log('dayReports', dayReports);
  console.log('cellsWithDay', cellsWithDay);

  cellsWithDay.forEach(cell => {
    const report = dayReports.find(r => r.day.isSame(cell.day, 'date'));
    console.log('found report:', report);
    const input = cell.cell.querySelector('input');
    if (input && report) {
      input.value = report.totalTimeSpendSeconds.toString();
    }
  })

  console.log(cells);
}
