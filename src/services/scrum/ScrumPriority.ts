import type { ScrumPriority } from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/scrum/priority';

export function findAllByTemplateId(id: string): Promise<ScrumPriority[]> {
  return GET<ScrumPriority[]>(`${apiPrefix}/allByTemplateId/${id}`);
}

export function savePriority(save: ScrumPriority): Promise<ScrumPriority> {
  return POST<ScrumPriority>(`${apiPrefix}`, save);
}

export function updatePriority(update: ScrumPriority): Promise<ScrumPriority> {
  return PUT<ScrumPriority>(`${apiPrefix}`, update);
}

export function deletePriority(id: string) {
  return DELETE(`${apiPrefix}/${id}`);
}

export function batchUpdatePriorities(data: ScrumPriority[]): Promise<ScrumPriority[]> {
  return PUT<ScrumPriority[]>(`${apiPrefix}/batch`, { data });
}
