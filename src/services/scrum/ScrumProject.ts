import type {
  MyScrumProject,
  ScrumProject,
  ScrumProjectDetail,
} from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/scrum/project';

export function saveProject(save: ScrumProject): Promise<ScrumProject> {
  return POST<ScrumProject>(`${base_path}`, save);
}

export function updateProject(update: ScrumProject): Promise<ScrumProject> {
  return PUT<ScrumProject>(`${base_path}`, update);
}

export function deleteProject(id: string) {
  return DELETE(`${base_path}/${id}`);
}

export function allMyProjects(): Promise<MyScrumProject> {
  return GET<MyScrumProject>(`${base_path}/all-my-projects`);
}

export function getProject(id: string): Promise<ScrumProject> {
  return GET<ScrumProject>(`${base_path}/${id}`);
}

export function getProjectDetail(id: string): Promise<ScrumProjectDetail> {
  return GET<ScrumProjectDetail>(`${base_path}/detail/${id}`);
}
