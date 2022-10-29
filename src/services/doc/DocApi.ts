import type { DocApi } from '@/services/doc/EntityType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/doc/api';

export function saveApi(save: DocApi): Promise<DocApi> {
  return POST<DocApi>(`${base_path}`, save);
}

export function updateApi(update: DocApi): Promise<DocApi> {
  return PUT<DocApi>(`${base_path}`, update);
}

export async function deleteApi(id: string) {
  await DELETE(`${base_path}/${id}`);
}

export async function getApiDetail(id: string): Promise<DocApi> {
  return GET<DocApi>(`${base_path}/detail/${id}`);
}
