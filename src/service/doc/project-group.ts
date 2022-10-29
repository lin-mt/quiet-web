import { DELETE, GET, POST, PUT } from '@/utils/request';
import { DocProjectGroup, DocProjectGroupMember } from '@/service/doc/type';

const base_path = '/doc/project-group';

export async function listAllProjectGroup(
  name?: string,
  group_ids?: string[]
): Promise<DocProjectGroup[]> {
  return GET<DocProjectGroup[]>(`${base_path}/all`, { name, group_ids });
}

export async function listAllProjectGroupMember(
  group_id: string
): Promise<DocProjectGroupMember[]> {
  return GET<DocProjectGroupMember[]>(`${base_path}/all-member/${group_id}`);
}

export async function addProjectGroupMember(
  save: DocProjectGroupMember
): Promise<DocProjectGroupMember> {
  return POST<DocProjectGroupMember>(`${base_path}/add-member`, save);
}

export async function updateProjectGroupMember(
  update: DocProjectGroupMember
): Promise<DocProjectGroupMember> {
  return POST<DocProjectGroupMember>(`${base_path}/update-member`, update);
}

export async function removeProjectGroupMember(
  group_id: string,
  user_id: string
) {
  await DELETE(`${base_path}/remove-member`, {
    group_id,
    user_id,
  });
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
