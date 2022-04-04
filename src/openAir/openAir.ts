import Tab = chrome.tabs.Tab;
import dayjs, { Dayjs } from 'dayjs';

export const TIMESHEET_URL =
  /https:\/\/.*\.app\.openair\.com\/timesheet.*uid=.*timesheet_id=\d*/;

export const TIMESHEET_TITLE = /OpenAir\s:\sTimesheets\s:\s.*/;

export const DATE_RANGE_SELECTOR = '#app_header_title:nth-child(2)';

export function tabContains(url: RegExp, title: RegExp) {
  return (tab: Tab): boolean =>
    !!tab.url && !!tab.title && url.test(tab.url) && title.test(tab.title);
}

export function parse(dateText: string): { from: Dayjs; to: Dayjs } {
  const split = dateText.trim().split('to');
  return { from: dayjs(split[0]), to: dayjs(split[1]) };
}