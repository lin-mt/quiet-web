import { request } from 'umi';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietClient } from '@/services/system/EntityType';
import type { Result } from '@/types/Result';

export function removeClientScope(id: string, scope: string) {
  return request('/api/system/client/removeClientScope', {
    method: 'POST',
    data: { id, clientScope: scope },
  });
}

export function removeClientAuthorizedGrantType(id: string, authorizedGrantType: string) {
  return request('/api/system/client/removeClientAuthorizedGrantType', {
    method: 'POST',
    data: { id, clientAuthorizedGrantType: authorizedGrantType },
  });
}

export async function queryClient(params?: any): Promise<Partial<RequestData<QuietClient>>> {
  return request<Result<Partial<RequestData<QuietClient>>>>('/api/system/client/page', {
    method: 'POST',
    data: params,
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveClient(save: QuietClient): Promise<QuietClient> {
  return request<Result<QuietClient>>('/api/system/client/save', {
    data: { save },
    method: 'POST',
  }).then((resp) => resp.data);
}

export async function updateClient(update: QuietClient): Promise<QuietClient> {
  return request<Result<QuietClient>>('/api/system/client/update', {
    data: { update },
    method: 'POST',
  }).then((resp) => resp.data);
}

export async function deleteClient(deleteId: string) {
  return request('/api/system/client/delete', {
    data: { deleteId },
    method: 'POST',
  });
}
