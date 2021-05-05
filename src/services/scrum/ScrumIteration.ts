import type { Result } from '@/types/Result';
import { request } from 'umi';
import type { ScrumIteration } from '@/services/scrum/EntitiyType';

const apiPrefix = '/api/scrum/iteration';

export function deleteIteration(deleteId: string) {
  return request(`${apiPrefix}/delete`, {
    method: 'POST',
    data: { deleteId },
  });
}

export function saveIteration(save: ScrumIteration): Promise<ScrumIteration> {
  return request<Result<ScrumIteration>>(`${apiPrefix}/save`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export function updateIteration(update: ScrumIteration): Promise<ScrumIteration> {
  return request<Result<ScrumIteration>>(`${apiPrefix}/update`, {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}
