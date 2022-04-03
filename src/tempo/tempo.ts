import { Dayjs } from 'dayjs';
import { addParamsTo } from '../utils/utils';

const BASE_URL = 'https://api.tempo.io/core/3';
const TOKEN = ''; // TODO do not commit

interface WorkEntry {
  key: string;
  description: string;
  startDate: Dayjs;
  timeSpendSeconds: number;
}

export async function fetchWorkLogs(issueKey: number, from: Dayjs, to: Dayjs): Promise<any> {
  const params: Record<string, string> = {
    issue: `TIME-${issueKey}`,
    from: from.format('YYYY-MM-DD'),
    to: to.format('YYYY-MM-DD'),
  };
  const url = addParamsTo(BASE_URL + '/worklogs', params);

  const response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + TOKEN },
  });

  return response.json();
}