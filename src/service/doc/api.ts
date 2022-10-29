import { DocApi } from '@/service/doc/type';
import { DELETE, GET, PAGE, PageResult, POST, PUT } from '@/utils/request';

const base_path = '/doc/api';

export async function pageApi(
  params?: Record<string, unknown>
): Promise<PageResult<DocApi>> {
  return PAGE<DocApi>(`${base_path}/page`, params);
}

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

export function listApi(project_id: string, name?: string): Promise<DocApi[]> {
  return GET<DocApi[]>(`${base_path}/list`, {
    project_id,
    name,
  });
}
