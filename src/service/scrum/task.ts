import { ScrumTask } from '@/service/scrum/type';
import { DELETE, GET, POST, PUT } from '@/utils/request';

const base_path = '/task';

export function listTask(
  demand_ids: string[],
  executor_ids?: string[]
): Promise<ScrumTask[]> {
  return GET<ScrumTask[]>(`${base_path}/list`, {
    demand_ids,
    executor_ids,
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
