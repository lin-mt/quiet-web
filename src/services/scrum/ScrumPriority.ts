import { request } from 'umi';
import type { Result } from '@/types/Result';

const apiPrefix = '/api/scrum/priority';

export function findAllByTemplateId(templateId: string): Promise<ScrumEntities.ScrumPriority[]> {
  return request<Result<ScrumEntities.ScrumPriority[]>>(`${apiPrefix}/findAllByTemplateId`, {
    data: { templateId },
    method: 'POST',
  }).then((resp) => resp.data);
}

export function savePriority(params: ScrumEntities.ScrumPriority) {
  return request(`${apiPrefix}/save`, {
    data: { save: params },
    method: 'POST',
  });
}

export function updatePriority(params: ScrumEntities.ScrumPriority) {
  return request(`${apiPrefix}/update`, {
    data: { update: params },
    method: 'POST',
  });
}

export function deletePriority(params: string) {
  return request(`${apiPrefix}/delete`, {
    data: { deleteId: params },
    method: 'POST',
  });
}

export function batchUpdatePriorities(params: ScrumEntities.ScrumPriority[]) {
  return request(`${apiPrefix}/updateBatch`, {
    data: { updateBatch: params },
    method: 'POST',
  });
}
