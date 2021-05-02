import { request } from 'umi';
import type { Result } from '@/types/Result';

const apiPrefix = '/api/scrum/demand';

export function saveDemand(
  save: ScrumEntities.ScrumDemand,
): Promise<Result<ScrumEntities.ScrumDemand>> {
  return request(`${apiPrefix}/save`, {
    data: { save },
    method: 'POST',
  });
}

export function updateDemand(
  update: ScrumEntities.ScrumDemand,
): Promise<Result<ScrumEntities.ScrumDemand>> {
  return request(`${apiPrefix}/update`, {
    data: { update },
    method: 'POST',
  });
}

export function findToBePlanned(
  projectId: string,
  offset: number,
  limit: number,
): Promise<ScrumEntities.ScrumDemand[]> {
  return request(`${apiPrefix}/scrollToBePlanned`, {
    method: 'POST',
    data: { id: projectId, offset, limit },
  }).then((resData) => {
    return resData.data;
  });
}
