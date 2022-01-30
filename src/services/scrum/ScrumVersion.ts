import type { ScrumVersion } from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/scrum/version';

export function deleteVersion(id: string) {
  DELETE(`${base_path}/${id}`);
}

export function saveVersion(save: ScrumVersion): Promise<ScrumVersion> {
  return POST<ScrumVersion>(`${base_path}`, save);
}

export function updateVersion(update: ScrumVersion): Promise<ScrumVersion> {
  return PUT<ScrumVersion>(`${base_path}`, update);
}

export function findDetailsByProjectId(id: string): Promise<ScrumVersion[]> {
  return GET<ScrumVersion[]>(`${base_path}/all/${id}`);
}
