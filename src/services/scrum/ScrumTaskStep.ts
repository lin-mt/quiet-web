import type { ScrumTaskStep } from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/scrum/taskStep';

export function getAllByTemplateId(id: string): Promise<ScrumTaskStep[]> {
  return GET<ScrumTaskStep[]>(`${apiPrefix}/allByTemplateId/${id}`);
}

export function saveTaskStep(save: ScrumTaskStep): Promise<ScrumTaskStep> {
  return POST<ScrumTaskStep>(`${apiPrefix}`, save);
}

export function updateTaskStep(update: ScrumTaskStep): Promise<ScrumTaskStep> {
  return PUT<ScrumTaskStep>(`${apiPrefix}`, update);
}

export function deleteTaskStep(id: string) {
  return DELETE(`${apiPrefix}/${id}`);
}

export function batchUpdateTaskStep(data: ScrumTaskStep[]): Promise<ScrumTaskStep[]> {
  return PUT<ScrumTaskStep[]>(`${apiPrefix}/batch`, { data });
}
