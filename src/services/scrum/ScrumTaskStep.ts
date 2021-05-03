import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { ScrumTaskStep } from '@/services/scrum/EntitiyType';

const apiPrefix = '/api/scrum/taskStep';

export function getAllByTemplateId(templateId: string): Promise<ScrumTaskStep[]> {
  return request<Result<ScrumTaskStep[]>>(`${apiPrefix}/getAllByTemplateId`, {
    method: 'POST',
    data: { templateId },
  }).then((resp) => resp.data);
}

export function saveTaskStep(save: ScrumTaskStep): Promise<ScrumTaskStep> {
  return request<Result<ScrumTaskStep>>(`${apiPrefix}/save`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export function updateTaskStep(update: ScrumTaskStep): Promise<ScrumTaskStep> {
  return request<Result<ScrumTaskStep>>(`${apiPrefix}/update`, {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export function deleteTaskStep(deleteId: string) {
  return request(`${apiPrefix}/delete`, {
    method: 'POST',
    data: { deleteId },
  });
}

export function batchUpdateTaskStep(updateBatch: ScrumTaskStep[]): Promise<ScrumTaskStep[]> {
  return request<Result<ScrumTaskStep[]>>(`${apiPrefix}/updateBatch`, {
    method: 'POST',
    data: { updateBatch },
  }).then((resp) => resp.data);
}
