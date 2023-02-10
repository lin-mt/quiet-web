import { DELETE, GET, POST, PUT } from '@/utils/request';
import { ScrumProjectGroup } from '@/service/scrum/type';

const base_path = '/project-group';

export async function listProjectGroup(
  name?: string,
  group_ids?: string[]
): Promise<ScrumProjectGroup[]> {
  return GET<ScrumProjectGroup[]>(`${base_path}/list`, { name, group_ids });
}

export async function saveProjectGroup(
  save: ScrumProjectGroup
): Promise<ScrumProjectGroup> {
  return POST<ScrumProjectGroup>(`${base_path}`, save);
}

export async function updateProjectGroup(
  update: ScrumProjectGroup
): Promise<ScrumProjectGroup> {
  return PUT<ScrumProjectGroup>(`${base_path}`, update);
}

export async function deleteProjectGroup(id: string) {
  await DELETE(`${base_path}/${id}`);
}
