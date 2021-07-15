import type {
  MyScrumProject,
  ScrumProject,
  ScrumProjectDetail,
} from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/scrum/project';

export function saveProject(save: ScrumProject): Promise<ScrumProject> {
  return POST<ScrumProject>(`${apiPrefix}`, save);
}

export function updateProject(update: ScrumProject): Promise<ScrumProject> {
  return PUT<ScrumProject>(`${apiPrefix}`, update);
}

export function deleteProject(id: string) {
  return DELETE(`${apiPrefix}/${id}`);
}

export function allMyProjects(): Promise<MyScrumProject> {
  return GET<MyScrumProject>(`${apiPrefix}/allMyProjects`);
}

export function getProject(id: string): Promise<ScrumProject> {
  return GET<ScrumProject>(`${apiPrefix}/${id}`);
}

export function getProjectDetail(id: string): Promise<ScrumProjectDetail> {
  return GET<ScrumProjectDetail>(`${apiPrefix}/detail/${id}`);
}
