import { request } from 'umi';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietDepartment, QuietUser } from '@/services/system/EntityType';
import type { Result } from '@/types/Result';

export function removeUsers(departmentId: string, userIds: string[]) {
  return request('/api/system/department/removeUsers', {
    method: 'POST',
    data: { id: departmentId, userIds },
  });
}

export function addUsers(departmentId: string, userIds: string[]) {
  return request('/api/system/department/addUsers', {
    method: 'POST',
    data: { id: departmentId, userIds },
  });
}

export function pageUser(params?: any): Promise<Partial<RequestData<QuietUser>>> {
  return request<Result<Partial<RequestData<QuietUser>>>>('/api/system/department/pageUser', {
    method: 'POST',
    data: params,
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function treeDepartment(): Promise<QuietDepartment[]> {
  return request<Result<QuietDepartment[]>>('/api/system/department/tree', {
    method: 'POST',
  }).then((resp) => resp.data);
}

export async function queryDepartment(
  params?: any,
): Promise<Partial<RequestData<QuietDepartment>>> {
  return request<Result<Partial<RequestData<QuietDepartment>>>>('/api/system/department/page', {
    method: 'POST',
    data: params,
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveDepartment(save: QuietDepartment): Promise<QuietDepartment> {
  return request<Result<QuietDepartment>>('/api/system/department/save', {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export async function updateDepartment(update: QuietDepartment): Promise<QuietDepartment> {
  return request<Result<QuietDepartment>>('/api/system/department/update', {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export async function deleteDepartment(params?: any) {
  return request('/api/system/department/delete', {
    method: 'POST',
    data: { deleteId: params },
  });
}
