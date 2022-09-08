import { DELETE, GET, POST, PUT } from '@/utils/request';
import { DocProjectGroup } from '@/service/doc/type';

const base_path = '/doc/project-group';

export async function listAllProjectGroup(
  name?: string,
  group_ids?: string[]
): Promise<DocProjectGroup[]> {
  return GET<DocProjectGroup[]>(`${base_path}/all`, { name, group_ids });
}

export async function saveProjectGroup(
  save: DocProjectGroup
): Promise<DocProjectGroup> {
  return POST<DocProjectGroup>(`${base_path}`, save);
}

export async function updateProjectGroup(
  update: DocProjectGroup
): Promise<DocProjectGroup> {
  return PUT<DocProjectGroup>(`${base_path}`, update);
}

export async function deleteProjectGroup(id: string) {
  await DELETE(`${base_path}/${id}`);
}
