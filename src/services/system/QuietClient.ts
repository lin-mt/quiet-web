import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietClient } from '@/services/system/EntityType';
import { DELETE, PAGE, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/system/client';

export function removeClientScope(id: string, scope: string) {
  return POST(`${base_path}/remove-client-scope`, { id, clientScope: scope });
}

export function removeClientAuthorizedGrantType(id: string, authorized_grant_type: string) {
  return POST(`${base_path}/remove-client-authorized-grant-type`, {
    id,
    client_authorized_grant_type: authorized_grant_type,
  });
}

export async function clientPage(params?: any): Promise<Partial<RequestData<QuietClient>>> {
  return PAGE<QuietClient>(`${base_path}/page`, params);
}

export async function saveClient(data: QuietClient): Promise<QuietClient> {
  return POST<QuietClient>(`${base_path}`, data);
}

export async function updateClient(data: QuietClient): Promise<QuietClient> {
  return PUT<QuietClient>(`${base_path}`, data);
}

export async function deleteClient(id: string) {
  await DELETE(`${base_path}/${id}`);
}
