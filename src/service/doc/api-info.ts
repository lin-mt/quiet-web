import { DocApiInfo } from '@/service/doc/type';
import { POST, PUT } from '@/utils/request';

const base_path = '/doc/api-info';

export function saveApiInfo(save: DocApiInfo): Promise<DocApiInfo> {
  return POST<DocApiInfo>(`${base_path}`, save);
}

export function updateApiInfo(update: DocApiInfo): Promise<DocApiInfo> {
  return PUT<DocApiInfo>(`${base_path}`, update);
}
