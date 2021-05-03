import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { ScrumVersion } from '@/services/scrum/EntitiyType';

const apiPrefix = '/api/scrum/version';

export function deleteVersion(deleteId: string) {
  return request(`${apiPrefix}/delete`, {
    method: 'POST',
    data: { deleteId },
  });
}

export function saveVersion(save: ScrumVersion): Promise<ScrumVersion> {
  return request<Result<ScrumVersion>>(`${apiPrefix}/save`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export function updateVersion(update: ScrumVersion): Promise<ScrumVersion> {
  return request<Result<ScrumVersion>>(`${apiPrefix}/update`, {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export function findDetailsByProjectId(id: string): Promise<ScrumVersion[]> {
  return request<Result<ScrumVersion[]>>(`${apiPrefix}/findDetailsByProjectId`, {
    method: 'POST',
    data: { id },
  }).then((resp) => resp.data);
}
