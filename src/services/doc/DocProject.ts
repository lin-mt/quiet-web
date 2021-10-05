import type { DocProject, MyDocProject } from '@/services/doc/EntityType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';
import type { DocApi, DocApiGroup } from '@/services/doc/EntityType';

const base_path = '/api/doc/project';

interface ProjectApiInfo {
  ungroup: DocApi[];
  grouped: Record<string, DocApi[]>;
  api_groups: DocApiGroup[];
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

export function findProjectInfo(id: string): Promise<DocProject> {
  return GET<DocProject>(`${base_path}/${id}`);
}

export function myProjects() {
  return GET<MyDocProject>(`${base_path}/my-project`);
}

export function listApiInfoById(id: string) {
  return GET<ProjectApiInfo>(`${base_path}/apis/${id}`);
}
