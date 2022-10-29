import { QuietHoliday } from '@/service/system/type';
import { GET, PUT } from '@/utils/request';

const base_path = '/system/holiday';

export function listHoliday(year: number): Promise<QuietHoliday[]> {
  return GET<QuietHoliday[]>(`${base_path}/year/${year}`);
}

export function updateHoliday(entity: QuietHoliday): Promise<QuietHoliday> {
  return PUT<QuietHoliday>(`${base_path}`, entity);
}
