import type { QuietRole } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import { DELETE, GET, PAGE, POST, PUT } from '@/utils/HttpUtils';

const baseUrl = '/api/system/role';

export async function treeRole(): Promise<QuietRole[]> {
  return GET<QuietRole[]>(`${baseUrl}/tree`);
}

export async function pageRole(params?: any): Promise<Partial<RequestData<QuietRole>>> {
  return PAGE<QuietRole>(`${baseUrl}/page`, params);
}

export async function saveRole(save: QuietRole): Promise<QuietRole> {
  return POST<QuietRole>(`${baseUrl}`, save);
}

export async function updateRole(update: QuietRole): Promise<QuietRole> {
  return PUT<QuietRole>(`${baseUrl}`, update);
}

export async function deleteRole(id: string) {
  await DELETE(`${baseUrl}/${id}`);
}
