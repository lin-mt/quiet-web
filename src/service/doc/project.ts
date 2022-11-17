import { DocProject } from '@/service/doc/type';
import { DELETE, GET, POST, PUT } from '@/utils/request';

const base_path = '/doc/project';

export function listAllProjectByGroupId(
  groupId?: string
): Promise<DocProject[]> {
  const id = !groupId ? '0' : groupId;
  return GET<DocProject[]>(`${base_path}/project-group/${id}`);
}

export function listProject(
  group_id?: string,
  name?: string,
  ids?: string[]
): Promise<DocProject[]> {
  return GET<DocProject[]>(`${base_path}/list`, { group_id, name, ids });
}

export function saveProject(save: DocProject): Promise<DocProject> {
  return POST<DocProject>(`${base_path}`, save);
}

export function updateProject(update: DocProject): Promise<DocProject> {
  return PUT<DocProject>(`${base_path}`, update);
}

export async function deleteProject(id: string) {
  await DELETE(`${base_path}/${id}`);
}

export function getProjectInfo(id: string): Promise<DocProject> {
  return GET<DocProject>(`${base_path}/${id}`);
}

export function updateSwaggerConfig(
  id: string,
  enabled: boolean,
  url: string,
  cron: string
): Promise<DocProject> {
  return PUT<DocProject>(`${base_path}/swagger/${id}`, null, {
    params: { enabled, url, cron },
  });
}
