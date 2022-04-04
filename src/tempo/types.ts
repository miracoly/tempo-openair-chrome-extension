import { Dayjs } from 'dayjs';

export interface WorkLog {
  issueKey: string;
  description: string;
  startDate: Dayjs;
  timeSpentSeconds: number;
}

export interface Report {
  totalTimeSpendSeconds: number;
  descriptions: string[];
}

export interface DayReport extends Report {
  day: Dayjs;
}

export interface WorkLogResponse {
  self: string;
  metadata: {
    count: number;
    offset: number;
    limit: number;
  };
  results: {
    self: string;
    tempoWorklogId: number;
    jiraWorklogId: number;
    issue: {
      self: string;
      key: string;
      id: number;
    };
    timeSpentSeconds: number;
    billableSeconds: number;
    startDate: string;
    startTime: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    author: {
      self: string;
      accountId: string;
      displayName: string;
    };
    attributes: {
      self: string;
      values: any[];
    };
  }[];
}
