import { ScrumProject } from './type';
import { DELETE, GET, POST, PUT } from '@/utils/request';

const base_path = '/scrum/project';

export function listProject(
  group_id?: string,
  name?: string,
  id?: string
): Promise<ScrumProject[]> {
  return GET<ScrumProject[]>(`${base_path}/list`, { group_id, name, id });
}

export function saveProject(save: ScrumProject): Promise<ScrumProject> {
  return POST<ScrumProject>(`${base_path}`, save);
}

export function updateProject(update: ScrumProject): Promise<ScrumProject> {
  return PUT<ScrumProject>(`${base_path}`, update);
}

export function deleteProject(id: string) {
  return DELETE(`${base_path}/${id}`);
}

export function getProject(id: string): Promise<ScrumProject> {
  return GET<ScrumProject>(`${base_path}/${id}`);
}
