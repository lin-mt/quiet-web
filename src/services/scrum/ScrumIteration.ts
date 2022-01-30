import type { ScrumIteration } from '@/services/scrum/EntitiyType';
import { DELETE, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/scrum/iteration';

export function end(id: string) {
  return POST(`${base_path}/end`, { id });
}

export function start(id: string) {
  return POST(`${base_path}/start`, { id });
}

export function deleteIteration(id: string) {
  return DELETE(`${base_path}/${id}`);
}

export function saveIteration(save: ScrumIteration): Promise<ScrumIteration> {
  return POST<ScrumIteration>(`${base_path}`, save);
}

export function updateIteration(update: ScrumIteration): Promise<ScrumIteration> {
  return PUT<ScrumIteration>(`${base_path}`, update);
}
