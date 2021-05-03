import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { ScrumDemand } from '@/services/scrum/EntitiyType';

const apiPrefix = '/api/scrum/demand';

export function saveDemand(save: ScrumDemand): Promise<ScrumDemand> {
  return request<Result<ScrumDemand>>(`${apiPrefix}/save`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export function updateDemand(update: ScrumDemand): Promise<ScrumDemand> {
  return request<Result<ScrumDemand>>(`${apiPrefix}/update`, {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export function findToBePlanned(
  projectId: string,
  offset: number,
  limit: number,
): Promise<ScrumDemand[]> {
  return request<Result<ScrumDemand[]>>(`${apiPrefix}/scrollToBePlanned`, {
    method: 'POST',
    data: { id: projectId, offset, limit },
  }).then((resData) => {
    return resData.data;
  });
}
