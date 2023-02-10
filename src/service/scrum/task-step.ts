import { GET, POST } from '@/utils/request';
import { ScrumTaskStep } from '@/service/scrum/type';

const base_path = '/task-step';

export function listTaskStep(template_id: string): Promise<ScrumTaskStep[]> {
  return GET<ScrumTaskStep[]>(`${base_path}/list`, { template_id });
}

export function batchSaveTaskStep(
  template_id,
  data: ScrumTaskStep[]
): Promise<ScrumTaskStep[]> {
  return POST<ScrumTaskStep[]>(`${base_path}/batch`, data, { template_id });
}
