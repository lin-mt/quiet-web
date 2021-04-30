import type { MomentInput } from 'moment';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

export function formatDate(value: MomentInput): string {
  return moment(value).format(dateFormat);
}

export function toMomentDate(value: MomentInput): moment.Moment {
  return moment(value, dateFormat);
}
