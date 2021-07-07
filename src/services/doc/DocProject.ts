import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { DocProject, MyDocProject } from '@/services/doc/EntityType';

const apiPrefix = '/api/doc/project';

export function saveProject(save: DocProject): Promise<DocProject> {
  return request<Result<DocProject>>(`${apiPrefix}/save`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export function updateProject(update: DocProject): Promise<DocProject> {
  return request<Result<DocProject>>(`${apiPrefix}/update`, {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export function deleteProject(deleteId: string) {
  return request(`${apiPrefix}/delete`, {
    method: 'POST',
    data: { deleteId },
  });
}

export function findProjectInfo(id: string): Promise<DocProject> {
  return request<Result<DocProject>>(`${apiPrefix}/projectInfo`, {
    method: 'POST',
    data: { id },
  }).then((resp) => resp.data);
}

export function myProjects() {
  return request<Result<MyDocProject>>(`${apiPrefix}/myProject`, {
    method: 'POST',
  }).then((resp) => resp.data);
}
