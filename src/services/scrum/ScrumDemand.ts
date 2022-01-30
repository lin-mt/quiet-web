import type { ScrumDemand } from '@/services/scrum/EntitiyType';
import type { ScrumDemandFilter } from '@/pages/scrum/project/detail/components/DemandPool';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/scrum/demand';

export function findAllByIterationId(id: string): Promise<ScrumDemand[]> {
  return GET<ScrumDemand[]>(`${base_path}/all/${id}`);
}

export function deleteDemand(id: string) {
  DELETE(`${base_path}/${id}`);
}

export function saveDemand(save: ScrumDemand): Promise<ScrumDemand> {
  return POST<ScrumDemand>(`${base_path}`, save);
}

export function updateDemand(update: ScrumDemand): Promise<ScrumDemand> {
  return PUT<ScrumDemand>(`${base_path}`, update);
}

export function findToBePlanned(
  project_id: string,
  demand_filter: ScrumDemandFilter,
  offset: number,
  limit: number,
): Promise<ScrumDemand[]> {
  return GET<ScrumDemand[]>(`${base_path}/scroll-to-be-planned`, {
    id: project_id,
    demand_filter: { planned: false, ...demand_filter },
    offset,
    limit,
  });
}

export function scrollByIterationId(
  iteration_id: string,
  offset: number,
  limit?: number,
): Promise<ScrumDemand[]> {
  return GET<ScrumDemand[]>(`${base_path}/scroll-by-iteration-id`, {
    id: iteration_id,
    offset,
    limit,
  });
}
