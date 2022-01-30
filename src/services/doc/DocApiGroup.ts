import type { DocApiGroup } from '@/services/doc/EntityType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/doc/api-group';

export function saveApiGroup(save: DocApiGroup): Promise<DocApiGroup> {
  return POST<DocApiGroup>(`${base_path}`, save);
}

export function updateApiGroup(update: DocApiGroup): Promise<DocApiGroup> {
  return PUT<DocApiGroup>(`${base_path}`, update);
}

export async function deleteApiGroup(id: string) {
  await DELETE(`${base_path}/${id}`);
}

export function listApiGroupByProjectIdAndName(
  project_id: string,
  name: string,
): Promise<DocApiGroup[]> {
  return GET<DocApiGroup[]>(`${base_path}/list-by-project-id-and-name`, { project_id, name });
}
