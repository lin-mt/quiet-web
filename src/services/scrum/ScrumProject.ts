import { request } from 'umi';
import type {
  MyScrumProject,
  ScrumProject,
  ScrumProjectDetail,
} from '@/services/scrum/EntitiyType';
import type { Result } from '@/types/Result';

const apiPrefix = '/api/scrum/project';

export function saveProject(save: ScrumProject): Promise<ScrumProject> {
  return request<Result<ScrumProject>>(`${apiPrefix}/save`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export function updateProject(update: ScrumProject): Promise<ScrumProject> {
  return request<Result<ScrumProject>>(`${apiPrefix}/update`, {
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

export function allMyProjects(): Promise<MyScrumProject> {
  return request<Result<MyScrumProject>>(`${apiPrefix}/allMyProjects`, {
    method: 'POST',
  }).then((resp) => resp.data);
}

export function findProjectInfo(id: string): Promise<ScrumProject> {
  return request<Result<ScrumProject>>(`${apiPrefix}/projectInfo`, {
    method: 'POST',
    data: { id },
  }).then((resp) => resp.data);
}

export function findProjectDetail(id: string): Promise<ScrumProjectDetail> {
  return request(`${apiPrefix}/detail`, {
    method: 'POST',
    data: { id },
  }).then((resp) => resp.data);
}
