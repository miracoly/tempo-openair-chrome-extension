export enum MessageType {
  RESPOND_DATE_RANGE,
  BUTTON_CLICK,
  REQUEST_DATE_RANGE,
  DATE_RANGE_NOT_FOUND,
  FILL_IN_REPORT,
  FAILURE,
  SUCCESS,
}

export interface Message {
  type: MessageType;
  payload?: any;
}
