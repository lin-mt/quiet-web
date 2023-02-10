import { ScrumDemand } from './type';
import { DELETE, GET, PAGE, PageResult, POST, PUT } from '@/utils/request';

const base_path = '/demand';

export function findAllByIterationId(id: string): Promise<ScrumDemand[]> {
  return GET<ScrumDemand[]>(`${base_path}/all/${id}`);
}

export function deleteDemand(id: string): Promise<void> {
  return DELETE<void>(`${base_path}/${id}`);
}

export function saveDemand(save: ScrumDemand): Promise<ScrumDemand> {
  return POST<ScrumDemand>(`${base_path}`, save);
}

export function updateDemand(update: ScrumDemand): Promise<ScrumDemand> {
  return PUT<ScrumDemand>(`${base_path}`, update);
}

export async function pageDemand(
  params?: Record<string, unknown>
): Promise<PageResult<ScrumDemand>> {
  return PAGE<ScrumDemand>(`${base_path}/page`, params);
}

export function listDemand(
  iteration_id: string,
  title?: string,
  priority_id?: string
): Promise<ScrumDemand[]> {
  return GET<ScrumDemand[]>(`${base_path}/list`, {
    iteration_id,
    title,
    priority_id,
  });
}
