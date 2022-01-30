import type { ScrumTask } from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/scrum/task';

export function findAllTaskByDemandIds(
  demand_ids: string[],
): Promise<Record<string, Record<string, ScrumTask[]>>> {
  return GET<Record<string, Record<string, ScrumTask[]>>>(`${base_path}/all-task-by-demand-ids`, {
    demand_ids,
  });
}

export function saveTask(save: ScrumTask): Promise<ScrumTask> {
  return POST<ScrumTask>(`${base_path}`, save);
}

export function updateTask(update: ScrumTask): Promise<ScrumTask> {
  return PUT<ScrumTask>(`${base_path}`, update);
}

export function deleteTask(id: string) {
  return DELETE(`${base_path}/${id}`);
}
