import { DELETE, GET, POST, PUT } from '@/utils/request';
import { ScrumIteration } from '@/service/scrum/type';

const base_path = '/iteration';

export function end(id: string, next_id?: string): Promise<ScrumIteration> {
  return POST<ScrumIteration>(`${base_path}/end`, null, { id, next_id });
}

export function start(id: string): Promise<ScrumIteration> {
  return POST<ScrumIteration>(`${base_path}/start`, null, { id });
}

export function deleteIteration(id: string): Promise<void> {
  return DELETE<void>(`${base_path}/${id}`);
}

export function saveIteration(save: ScrumIteration): Promise<ScrumIteration> {
  return POST<ScrumIteration>(`${base_path}`, save);
}

export function updateIteration(
  update: ScrumIteration
): Promise<ScrumIteration> {
  return PUT<ScrumIteration>(`${base_path}`, update);
}

export function getIteration(id: string): Promise<ScrumIteration> {
  return GET<ScrumIteration>(`${base_path}/${id}`);
}

export function listIteration(
  version_ids?: string[]
): Promise<ScrumIteration[]> {
  return GET<ScrumIteration[]>(`${base_path}/list`, { version_ids });
}
