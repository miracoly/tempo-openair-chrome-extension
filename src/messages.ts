export enum MessageType {
  SUCCESS,
  BUTTON_CLICK,
  REQUEST_DATE_RANGE,
  NOT_ON_OPENAIR_TIMESHEET_SITE,
  DATE_RANGE_NOT_FOUND,
}

export interface Message {
  type: MessageType;
  payload?: any;
}
