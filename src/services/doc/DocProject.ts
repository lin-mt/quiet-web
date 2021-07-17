import type { DocProject, MyDocProject } from '@/services/doc/EntityType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/doc/project';

export function saveProject(save: DocProject): Promise<DocProject> {
  return POST<DocProject>(`${apiPrefix}`, save);
}

export function updateProject(update: DocProject): Promise<DocProject> {
  return PUT<DocProject>(`${apiPrefix}`, update);
}

export function deleteProject(id: string) {
  DELETE(`${apiPrefix}/${id}`);
}

export function findProjectInfo(id: string): Promise<DocProject> {
  return GET<DocProject>(`${apiPrefix}/${id}`);
}

export function myProjects() {
  return GET<MyDocProject>(`${apiPrefix}/myProject`);
}
