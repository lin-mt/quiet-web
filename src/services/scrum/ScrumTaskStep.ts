import { request } from 'umi';
import type { Result } from '@/types/Result';

const apiPrefix = '/api/scrum/taskStep';

export function getAllByTemplateId(templateId: string): Promise<ScrumEntities.ScrumTaskStep[]> {
  return request<Result<ScrumEntities.ScrumTaskStep[]>>(`${apiPrefix}/getAllByTemplateId`, {
    data: { templateId },
    method: 'POST',
  }).then((resp) => resp.data);
}

export function saveTaskStep(params: ScrumEntities.ScrumTaskStep) {
  return request(`${apiPrefix}/save`, {
    data: { save: params },
    method: 'POST',
  });
}

export function updateTaskStep(params: ScrumEntities.ScrumTaskStep) {
  return request(`${apiPrefix}/update`, {
    data: { update: params },
    method: 'POST',
  });
}

export function deleteTaskStep(params: string) {
  return request(`${apiPrefix}/delete`, {
    data: { deleteId: params },
    method: 'POST',
  });
}

export function batchUpdateTaskStep(params: ScrumEntities.ScrumTaskStep[]) {
  return request(`${apiPrefix}/updateBatch`, {
    data: { updateBatch: params },
    method: 'POST',
  });
}
