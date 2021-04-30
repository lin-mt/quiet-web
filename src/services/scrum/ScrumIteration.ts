import type { Result } from '@/types/Result';
import request from 'umi-request';

const apiPrefix = '/api/scrum/iteration';

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
