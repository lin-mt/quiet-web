import type { Result } from '@/types/Result';
import request from 'umi-request';

const apiPrefix = '/api/scrum/version';

export function deleteVersion(deleteId: string) {
  return request(`${apiPrefix}/delete`, {
    data: { deleteId },
    method: 'POST',
  });
}

export function saveVersion(params?: any) {
  return request(`${apiPrefix}/save`, {
    data: { save: params },
    method: 'POST',
  });
}

export function updateVersion(params?: any) {
  return request(`${apiPrefix}/update`, {
    data: { update: params },
    method: 'POST',
  });
}

export function findDetailsByProjectId(id: string): Promise<ScrumEntities.ScrumVersion[]> {
  return request<Result<ScrumEntities.ScrumVersion[]>>(`${apiPrefix}/findDetailsByProjectId`, {
    data: { id },
    method: 'POST',
  }).then((result) => {
    return result.data;
  });
}
