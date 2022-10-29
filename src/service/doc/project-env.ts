import { DELETE, GET, POST, PUT } from '@/utils/request';
import { DocProjectEnv } from './type';

const base_path = '/doc/project-env';

export function saveProjectEnv(save: DocProjectEnv): Promise<DocProjectEnv> {
  return POST<DocProjectEnv>(`${base_path}`, save);
}

export function updateProjectEnv(
  update: DocProjectEnv
): Promise<DocProjectEnv> {
  return PUT<DocProjectEnv>(`${base_path}`, update);
}

export async function deleteProjectEnv(id: string) {
  await DELETE(`${base_path}/${id}`);
}

export function listEnv(projectId: string): Promise<DocProjectEnv[]> {
  return GET<DocProjectEnv[]>(`${base_path}/list/${projectId}`);
}
