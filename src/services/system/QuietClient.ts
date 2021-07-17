import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietClient } from '@/services/system/EntityType';
import { DELETE, PAGE, POST, PUT } from '@/utils/HttpUtils';

const baseUrl = '/api/system/client';

export function removeClientScope(id: string, scope: string) {
  return POST(`${baseUrl}/removeClientScope`, { id, clientScope: scope });
}

export function removeClientAuthorizedGrantType(id: string, authorizedGrantType: string) {
  return POST(`${baseUrl}/removeClientAuthorizedGrantType`, {
    id,
    clientAuthorizedGrantType: authorizedGrantType,
  });
}

export async function clientPage(params?: any): Promise<Partial<RequestData<QuietClient>>> {
  return PAGE<QuietClient>(`${baseUrl}/page`, params);
}

export async function saveClient(data: QuietClient): Promise<QuietClient> {
  return POST<QuietClient>(`${baseUrl}`, data);
}

export async function updateClient(data: QuietClient): Promise<QuietClient> {
  return PUT<QuietClient>(`${baseUrl}`, data);
}

export async function deleteClient(id: string) {
  await DELETE(`${baseUrl}/${id}`);
}
