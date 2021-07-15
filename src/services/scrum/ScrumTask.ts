import type { ScrumTask } from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/scrum/task';

export function findAllTaskByDemandIds(
  demandIds: string[],
): Promise<Record<string, Record<string, ScrumTask[]>>> {
  return GET<Record<string, Record<string, ScrumTask[]>>>(`${apiPrefix}/allTaskByDemandIds`, {
    demandIds,
  });
}

export function saveTask(save: ScrumTask): Promise<ScrumTask> {
  return POST<ScrumTask>(`${apiPrefix}`, save);
}

export function updateTask(update: ScrumTask): Promise<ScrumTask> {
  return PUT<ScrumTask>(`${apiPrefix}`, update);
}

export function deleteTask(id: string) {
  return DELETE(`${apiPrefix}/${id}`);
}
