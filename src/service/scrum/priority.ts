import { ScrumPriority } from '@/service/scrum/type';
import { GET, POST } from '@/utils/request';

const base_path = '/scrum/priority';

export function listPriority(template_id: string): Promise<ScrumPriority[]> {
  return GET<ScrumPriority[]>(`${base_path}/list`, { template_id });
}

export function batchSavePriorities(
  template_id,
  data: ScrumPriority[]
): Promise<ScrumPriority[]> {
  return POST<ScrumPriority[]>(`${base_path}/batch`, data, { template_id });
}
