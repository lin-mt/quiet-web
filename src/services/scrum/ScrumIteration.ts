import type { ScrumIteration } from '@/services/scrum/EntitiyType';
import { DELETE, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/scrum/iteration';

export function end(id: string) {
  return POST(`${apiPrefix}/end`, { id });
}

export function start(id: string) {
  return POST(`${apiPrefix}/start`, { id });
}

export function deleteIteration(id: string) {
  return DELETE(`${apiPrefix}/${id}`);
}

export function saveIteration(save: ScrumIteration): Promise<ScrumIteration> {
  return POST<ScrumIteration>(`${apiPrefix}`, save);
}

export function updateIteration(update: ScrumIteration): Promise<ScrumIteration> {
  return PUT<ScrumIteration>(`${apiPrefix}/update`, update);
}
