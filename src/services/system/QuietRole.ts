import { request } from 'umi';
import type { QuietRole } from '@/services/system/EntityType';
import type { Result } from '@/types/Result';
import type { RequestData } from '@ant-design/pro-table/lib/typing';

export async function treeRole(): Promise<QuietRole[]> {
  return request<Result<QuietRole[]>>('/api/system/role/tree', {
    method: 'POST',
  }).then((resp) => resp.data);
}

export async function queryRole(params?: any): Promise<Partial<RequestData<QuietRole>>> {
  return request<Result<Partial<RequestData<QuietRole>>>>('/api/system/role/page', {
    method: 'POST',
    data: params,
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveRole(save: QuietRole): Promise<QuietRole> {
  return request<Result<QuietRole>>('/api/system/role/save', {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export async function updateRole(update: QuietRole): Promise<QuietRole> {
  return request<Result<QuietRole>>('/api/system/role/update', {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export async function deleteRole(deleteId: string) {
  return request('/api/system/role/delete', {
    method: 'POST',
    data: { deleteId },
  });
}
