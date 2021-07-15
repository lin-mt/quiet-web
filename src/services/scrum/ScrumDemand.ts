import type { ScrumDemand } from '@/services/scrum/EntitiyType';
import type { ScrumDemandFilter } from '@/pages/scrum/project/detail/components/DemandPool';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/scrum/demand';

export function findAllByIterationId(id: string): Promise<ScrumDemand[]> {
  return GET<ScrumDemand[]>(`${apiPrefix}/all/${id}`);
}

export function deleteDemand(id: string) {
  DELETE(`${apiPrefix}/${id}`);
}

export function saveDemand(save: ScrumDemand): Promise<ScrumDemand> {
  return POST<ScrumDemand>(`${apiPrefix}`, save);
}

export function updateDemand(update: ScrumDemand): Promise<ScrumDemand> {
  return PUT<ScrumDemand>(`${apiPrefix}`, update);
}

export function findToBePlanned(
  projectId: string,
  demandFilter: ScrumDemandFilter,
  offset: number,
  limit: number,
): Promise<ScrumDemand[]> {
  return GET<ScrumDemand[]>(`${apiPrefix}/scrollToBePlanned`, {
    id: projectId,
    demandFilter: { planned: false, ...demandFilter },
    offset,
    limit,
  });
}

export function scrollByIterationId(
  iterationId: string,
  offset: number,
  limit?: number,
): Promise<ScrumDemand[]> {
  return GET<ScrumDemand[]>(`${apiPrefix}/scrollByIterationId`, { id: iterationId, offset, limit });
}
