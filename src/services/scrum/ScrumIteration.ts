import type { Result } from '@/types/Result';
import { request } from 'umi';

const apiPrefix = '/api/scrum/iteration';

export function deleteIteration(deleteId: string) {
  return request(`${apiPrefix}/delete`, {
    data: { deleteId },
    method: 'POST',
  });
}

export function saveIteration(params?: any): Promise<Result<ScrumEntities.ScrumIteration>> {
  return request(`${apiPrefix}/save`, {
    data: { save: params },
    method: 'POST',
  });
}

export function updateIteration(params?: any): Promise<Result<ScrumEntities.ScrumIteration>> {
  return request(`${apiPrefix}/update`, {
    data: { update: params },
    method: 'POST',
  });
}
