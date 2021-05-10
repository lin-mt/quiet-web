import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { ScrumTask } from '@/services/scrum/EntitiyType';

const apiPrefix = '/api/scrum/task';

export function findAllTaskByDemandIds(
  demandIds: string[],
): Promise<Record<string, Record<string, ScrumTask[]>>> {
  return request<Result<Record<string, Record<string, ScrumTask[]>>>>(
    `${apiPrefix}/findAllTaskByDemandIds`,
    {
      method: 'POST',
      data: { demandIds },
    },
  ).then((resp) => resp.data);
}

export function saveTask(save: ScrumTask): Promise<ScrumTask> {
  return request<Result<ScrumTask>>(`${apiPrefix}/save`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export function updateTask(update: ScrumTask): Promise<ScrumTask> {
  return request<Result<ScrumTask>>(`${apiPrefix}/update`, {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export function deleteTask(deleteId: string) {
  return request(`${apiPrefix}/delete`, {
    method: 'POST',
    data: { deleteId },
  });
}
