import type { DocProject, MyDocProject } from '@/services/doc/EntityType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';
import type { DocApi, DocApiGroup } from '@/services/doc/EntityType';

const apiPrefix = '/api/doc/project';

interface ProjectApiInfo {
  ungroup: DocApi[];
  grouped: Record<string, DocApi[]>;
  apiGroups: DocApiGroup[];
}

export function saveProject(save: DocProject): Promise<DocProject> {
  return POST<DocProject>(`${apiPrefix}`, save);
}

export function updateProject(update: DocProject): Promise<DocProject> {
  return PUT<DocProject>(`${apiPrefix}`, update);
}

export async function deleteProject(id: string) {
  await DELETE(`${apiPrefix}/${id}`);
}

export function findProjectInfo(id: string): Promise<DocProject> {
  return GET<DocProject>(`${apiPrefix}/${id}`);
}

export function myProjects() {
  return GET<MyDocProject>(`${apiPrefix}/myProject`);
}

export function listApiInfoById(id: string) {
  return GET<ProjectApiInfo>(`${apiPrefix}/apis/${id}`);
}
