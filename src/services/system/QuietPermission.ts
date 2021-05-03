import { request } from 'umi';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietPermission } from '@/services/system/EntityType';
import type { Result } from '@/types/Result';

export async function queryPermission(
  params?: any,
): Promise<Partial<RequestData<QuietPermission>>> {
  return request<Result<Partial<RequestData<QuietPermission>>>>('/api/system/permission/page', {
    method: 'POST',
    data: params,
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function savePermission(save: QuietPermission): Promise<QuietPermission> {
  return request<Result<QuietPermission>>('/api/system/permission/save', {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export async function updatePermission(update: QuietPermission): Promise<QuietPermission> {
  return request<Result<QuietPermission>>('/api/system/permission/update', {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export async function deletePermission(deleteId: string) {
  return request('/api/system/permission/delete', {
    method: 'POST',
    data: { deleteId },
  });
}
