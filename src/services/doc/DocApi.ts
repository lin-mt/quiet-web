import type { ApiDetail, DocApi } from '@/services/doc/EntityType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/doc/api';

export function saveApi(save: DocApi): Promise<DocApi> {
  return POST<DocApi>(`${apiPrefix}`, save);
}

export function updateApi(update: DocApi): Promise<DocApi> {
  return PUT<DocApi>(`${apiPrefix}`, update);
}

export async function deleteApi(id: string) {
  await DELETE(`${apiPrefix}/${id}`);
}

export async function getAiDetail(id: string): Promise<ApiDetail> {
  return GET<ApiDetail>(`${apiPrefix}/detail/${id}`);
}
