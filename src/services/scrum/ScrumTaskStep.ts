import type { ScrumTaskStep } from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/scrum/task-step';

export function getAllByTemplateId(id: string): Promise<ScrumTaskStep[]> {
  return GET<ScrumTaskStep[]>(`${base_path}/all-by-template-id/${id}`);
}

export function saveTaskStep(save: ScrumTaskStep): Promise<ScrumTaskStep> {
  return POST<ScrumTaskStep>(`${base_path}`, save);
}

export function updateTaskStep(update: ScrumTaskStep): Promise<ScrumTaskStep> {
  return PUT<ScrumTaskStep>(`${base_path}`, update);
}

export function deleteTaskStep(id: string) {
  return DELETE(`${base_path}/${id}`);
}

export function batchUpdateTaskStep(data: ScrumTaskStep[]): Promise<ScrumTaskStep[]> {
  return PUT<ScrumTaskStep[]>(`${base_path}/batch`, { data });
}
