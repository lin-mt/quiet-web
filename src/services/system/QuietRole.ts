import type { QuietRole } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import { DELETE, GET, PAGE, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/system/role';

export async function treeRole(): Promise<QuietRole[]> {
  return GET<QuietRole[]>(`${base_path}/tree`);
}

export async function pageRole(params?: any): Promise<Partial<RequestData<QuietRole>>> {
  return PAGE<QuietRole>(`${base_path}/page`, params);
}

export async function saveRole(save: QuietRole): Promise<QuietRole> {
  return POST<QuietRole>(`${base_path}`, save);
}

export async function updateRole(update: QuietRole): Promise<QuietRole> {
  return PUT<QuietRole>(`${base_path}`, update);
}

export async function deleteRole(id: string) {
  await DELETE(`${base_path}/${id}`);
}
