import { DELETE, GET, POST, PUT } from '@/utils/request';
import { ScrumVersion } from '@/service/scrum/type';

const base_path = '/scrum/version';

export function deleteVersion(id: string): Promise<void> {
  return DELETE<void>(`${base_path}/${id}`);
}

export function saveVersion(save: ScrumVersion): Promise<ScrumVersion> {
  return POST<ScrumVersion>(`${base_path}`, save);
}

export function updateVersion(update: ScrumVersion): Promise<ScrumVersion> {
  return PUT<ScrumVersion>(`${base_path}`, update);
}

export function getVersion(id: string): Promise<ScrumVersion> {
  return GET<ScrumVersion>(`${base_path}/${id}`);
}

export function treeVersion(project_id: string): Promise<ScrumVersion[]> {
  return GET<ScrumVersion[]>(`${base_path}/tree`, { project_id });
}
