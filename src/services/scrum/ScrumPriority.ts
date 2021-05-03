import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { ScrumPriority } from '@/services/scrum/EntitiyType';

const apiPrefix = '/api/scrum/priority';

export function findAllByTemplateId(templateId: string): Promise<ScrumPriority[]> {
  return request<Result<ScrumPriority[]>>(`${apiPrefix}/findAllByTemplateId`, {
    method: 'POST',
    data: { templateId },
  }).then((resp) => resp.data);
}

export function savePriority(save: ScrumPriority): Promise<ScrumPriority> {
  return request<Result<ScrumPriority>>(`${apiPrefix}/save`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export function updatePriority(update: ScrumPriority): Promise<ScrumPriority> {
  return request<Result<ScrumPriority>>(`${apiPrefix}/update`, {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export function deletePriority(deleteId: string) {
  return request(`${apiPrefix}/delete`, {
    method: 'POST',
    data: { deleteId },
  });
}

export function batchUpdatePriorities(updateBatch: ScrumPriority[]): Promise<ScrumPriority[]> {
  return request<Result<ScrumPriority[]>>(`${apiPrefix}/updateBatch`, {
    method: 'POST',
    data: { updateBatch },
  }).then((resp) => resp.data);
}
