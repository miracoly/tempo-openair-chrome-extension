import Tab = chrome.tabs.Tab;
import { parseBoundaries, tabContains, TIMESHEET_TITLE, TIMESHEET_URL } from './openAir';
import dayjs from 'dayjs';

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

describe('tabContains', () => {
  it('should return true if url and title match', () => {
    const tab: Partial<Tab> = {
      url: 'https://valtech.app.openair.com/timesheet.pl?app=ta;uid=1a2b3c4d5e6c7e8f9g;r=123456;action=grid;timesheet_id=123456789',
      title: 'OpenAir : Timesheets : Valtech',
    };

    const doesContain = tabContains(TIMESHEET_URL, TIMESHEET_TITLE)(tab as Tab);

    expect(doesContain).toBeTruthy();
  });
});

describe('parseBoundaries', () => {
  it('should return date boundaries from text', () => {
    const boundaries = parseBoundaries('04-04-22 to 10-04-22');

    expect(boundaries.from).toStrictEqual(dayjs('04-04-2022', 'DD-MM-YYYY'))
    expect(boundaries.to).toStrictEqual(dayjs('10-04-2022', 'DD-MM-YYYY'))
  });
  it('should return date boundaries from text', () => {
    const boundaries = parseBoundaries('21-03-22 to 27-03-22');

    expect(boundaries.from).toStrictEqual(dayjs('21-03-2022', 'DD-MM-YYYY'))
    expect(boundaries.to).toStrictEqual(dayjs('27-03-2022', 'DD-MM-YYYY'))
  });
})