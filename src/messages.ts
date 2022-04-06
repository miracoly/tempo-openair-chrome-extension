export enum MessageType {
  RESPOND_DATE_RANGE,
  BUTTON_CLICK,
  REQUEST_DATE_RANGE,
  NOT_ON_OPENAIR_TIMESHEET_SITE,
  DATE_RANGE_NOT_FOUND,
  FILL_IN_REPORT,
  UNEXPECTED_FAILURE,
  SUCCESS,
  ISSUE_KEY_NOT_SET,
}

export interface Message {
  type: MessageType;
  payload?: any;
}
