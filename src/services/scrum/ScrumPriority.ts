import type { ScrumPriority } from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/scrum/priority';

export function findAllByTemplateId(id: string): Promise<ScrumPriority[]> {
  return GET<ScrumPriority[]>(`${base_path}/all-by-template-id/${id}`);
}

export function savePriority(save: ScrumPriority): Promise<ScrumPriority> {
  return POST<ScrumPriority>(`${base_path}`, save);
}

export function updatePriority(update: ScrumPriority): Promise<ScrumPriority> {
  return PUT<ScrumPriority>(`${base_path}`, update);
}

export function deletePriority(id: string) {
  return DELETE(`${base_path}/${id}`);
}

export function batchUpdatePriorities(data: ScrumPriority[]): Promise<ScrumPriority[]> {
  return PUT<ScrumPriority[]>(`${base_path}/batch`, { data });
}
