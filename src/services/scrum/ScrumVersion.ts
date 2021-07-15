import type { ScrumVersion } from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/scrum/version';

export function deleteVersion(id: string) {
  DELETE(`${apiPrefix}/${id}`);
}

export function saveVersion(save: ScrumVersion): Promise<ScrumVersion> {
  return POST<ScrumVersion>(`${apiPrefix}`, save);
}

export function updateVersion(update: ScrumVersion): Promise<ScrumVersion> {
  return PUT<ScrumVersion>(`${apiPrefix}`, update);
}

export function findDetailsByProjectId(id: string): Promise<ScrumVersion[]> {
  return GET<ScrumVersion[]>(`${apiPrefix}/all/${id}`);
}
