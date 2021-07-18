import type { DocApiGroup } from '@/services/doc/EntityType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/doc/apiGroup';

export function saveApiGroup(save: DocApiGroup): Promise<DocApiGroup> {
  return POST<DocApiGroup>(`${apiPrefix}`, save);
}

export function updateApiGroup(update: DocApiGroup): Promise<DocApiGroup> {
  return PUT<DocApiGroup>(`${apiPrefix}`, update);
}

export async function deleteApiGroup(id: string) {
  await DELETE(`${apiPrefix}/${id}`);
}

export function listApiGroupByProjectIdAndName(
  projectId: string,
  name: string,
): Promise<DocApiGroup[]> {
  return GET<DocApiGroup[]>(`${apiPrefix}/listByProjectIdAndName`, { projectId, name });
}
