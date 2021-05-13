import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { ScrumDemand } from '@/services/scrum/EntitiyType';
import type { ScrumDemandFilter } from '@/pages/scrum/project/detail/components/DemandPool';

const apiPrefix = '/api/scrum/demand';

export function findAllByIterationId(iterationId: string): Promise<ScrumDemand[]> {
  return request<Result<ScrumDemand[]>>(`${apiPrefix}/findAllByIterationId`, {
    method: 'POST',
    data: { iterationId },
  }).then((resp) => resp.data);
}

export function deleteDemand(deleteId: string) {
  return request(`${apiPrefix}/delete`, {
    method: 'POST',
    data: { deleteId },
  });
}

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
  demandFilter: ScrumDemandFilter,
  offset: number,
  limit: number,
): Promise<ScrumDemand[]> {
  return request<Result<ScrumDemand[]>>(`${apiPrefix}/scrollToBePlanned`, {
    method: 'POST',
    data: { id: projectId, demandFilter: { planned: false, ...demandFilter }, offset, limit },
  }).then((resData) => {
    return resData.data;
  });
}

export function scrollByIterationId(
  iterationId: string,
  offset: number,
  limit?: number,
): Promise<ScrumDemand[]> {
  return request<Result<ScrumDemand[]>>(`${apiPrefix}/scrollByIterationId`, {
    method: 'POST',
    data: { id: iterationId, offset, limit },
  }).then((resData) => {
    return resData.data;
  });
}
