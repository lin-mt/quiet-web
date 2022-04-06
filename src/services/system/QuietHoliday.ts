import type { QuietHoliday } from '@/services/system/EntityType';
import { GET, PUT } from '@/utils/HttpUtils';

const base_path = '/api/system/holiday';

export function listHoliday(year: number): Promise<QuietHoliday[]> {
  return GET<QuietHoliday[]>(`${base_path}/year/${year}`);
}

export function updateHoliday(entity: QuietHoliday): Promise<QuietHoliday> {
  return PUT<QuietHoliday>(`${base_path}`, entity);
}
