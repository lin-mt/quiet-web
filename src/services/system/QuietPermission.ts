import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietPermission } from '@/services/system/EntityType';
import { DELETE, PAGE, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/system/permission';

export async function pagePermission(params?: any): Promise<Partial<RequestData<QuietPermission>>> {
  return PAGE<QuietPermission>(`${base_path}/page`, params);
}

export async function savePermission(save: QuietPermission): Promise<QuietPermission> {
  return POST<QuietPermission>(`${base_path}`, save);
}

export async function updatePermission(update: QuietPermission): Promise<QuietPermission> {
  return PUT<QuietPermission>(`${base_path}`, update);
}

export async function deletePermission(id: string) {
  await DELETE(`${base_path}/${id}`);
}
