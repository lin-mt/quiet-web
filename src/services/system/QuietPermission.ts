import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietPermission } from '@/services/system/EntityType';
import { DELETE, PAGE, POST, PUT } from '@/utils/HttpUtils';

const baseUrl = '/api/system/permission';

export async function pagePermission(params?: any): Promise<Partial<RequestData<QuietPermission>>> {
  return PAGE<QuietPermission>(`${baseUrl}/page`, params);
}

export async function savePermission(save: QuietPermission): Promise<QuietPermission> {
  return POST<QuietPermission>(`${baseUrl}`, save);
}

export async function updatePermission(update: QuietPermission): Promise<QuietPermission> {
  return PUT<QuietPermission>(`${baseUrl}`, update);
}

export async function deletePermission(id: string) {
  DELETE(`${baseUrl}/${id}`);
}
