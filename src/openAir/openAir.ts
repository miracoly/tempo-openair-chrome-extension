import Tab = chrome.tabs.Tab;
import dayjs, { Dayjs } from 'dayjs';

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

export const TIMESHEET_URL = /https:\/\/.*\.app\.openair\.com\/timesheet.*uid=.*timesheet_id=\d*/;
export const TIMESHEET_TITLE = /OpenAir\s:\sTimesheets\s:\s.*/;

export const DATE_RANGE_SELECTOR = '#app_header_title span:nth-child(2)';
export const TABLE_CELLS_SELECTOR =
  '#timesheet_grid table tbody tr:first-child td:nth-child(n+4):not(:last-child)';
export const DESCRIPTION_POPUP_SELECTOR =
  'body > div.dialogBlock.dialogBlock1Column.fade.ui-draggable';
export const TEXTAREA_SELECTOR = 'textarea#tm_notes';

export function tabContains(url: RegExp, title: RegExp) {
  return (tab: Tab): boolean =>
    !!tab.url && !!tab.title && url.test(tab.url) && title.test(tab.title);
}

export function parseBoundaries(dateText: string): { from: Dayjs; to: Dayjs } {
  const split = dateText.split('to').map(dateString => dateString.trim());
  return { from: dayjs(split[0], 'DD-MM-YY'), to: dayjs(split[1], 'DD-MM-YY') };
}

export type CellWithDate = {
  cell: HTMLTableCellElement;
  day?: Dayjs;
};

export function toTableCellWithDay(cell: HTMLTableCellElement): CellWithDate {
  const dateText = cell.querySelector('a')?.getAttribute('data-additional-title');
  const day = dateText ? dayjs(dateText.split(' ')[1], 'DD-MM-YY') : undefined;
  return { day, cell };
}
