import { DocApiGroup } from '@/service/doc/type';
import { DELETE, GET, POST, PUT } from '@/utils/request';

const base_path = '/api-group';

export function getApiGroup(id: string): Promise<DocApiGroup> {
  return GET<DocApiGroup>(`${base_path}/${id}`);
}

export function saveApiGroup(save: DocApiGroup): Promise<DocApiGroup> {
  return POST<DocApiGroup>(`${base_path}`, save);
}

export function updateApiGroup(update: DocApiGroup): Promise<DocApiGroup> {
  return PUT<DocApiGroup>(`${base_path}`, update);
}

export async function deleteApiGroup(id: string) {
  await DELETE(`${base_path}/${id}`);
}

export function listApiGroup(
  project_id: string,
  name?: string,
  ids?: string[],
  limit?: number
): Promise<DocApiGroup[]> {
  return GET<DocApiGroup[]>(`${base_path}/list`, {
    project_id,
    name,
    ids,
    limit,
  });
}
