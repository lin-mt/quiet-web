import type { DocProjectEnvironment } from '@/services/doc/EntityType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/doc/project-environment';

export function saveProjectEnvironment(
  save: DocProjectEnvironment,
): Promise<DocProjectEnvironment> {
  return POST<DocProjectEnvironment>(`${base_path}`, save);
}

export function updateProjectEnvironment(
  update: DocProjectEnvironment,
): Promise<DocProjectEnvironment> {
  return PUT<DocProjectEnvironment>(`${base_path}`, update);
}

export async function deleteProjectEnvironment(id: string) {
  await DELETE(`${base_path}/${id}`);
}

export function listByProjectId(projectId: string): Promise<DocProjectEnvironment[]> {
  return GET<DocProjectEnvironment[]>(`${base_path}/list-by-project-id/${projectId}`);
}
