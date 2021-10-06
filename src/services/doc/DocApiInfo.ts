import type { DocApiInfo } from '@/services/doc/EntityType';
import { POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/doc/api-info';

export function saveApiInfo(save: DocApiInfo): Promise<DocApiInfo> {
  return POST<DocApiInfo>(`${base_path}`, save);
}

export function updateApiInfo(update: DocApiInfo): Promise<DocApiInfo> {
  return PUT<DocApiInfo>(`${base_path}`, update);
}
