import { request } from 'umi';

export function removeUsers(departmentId: string, userIds: string[]) {
  return request('/api/system/department/removeUsers', {
    data: { id: departmentId, userIds },
    method: 'POST',
  });
}

export function addUsers(departmentId: string, userIds: string[]) {
  return request('/api/system/department/addUsers', {
    data: { id: departmentId, userIds },
    method: 'POST',
  });
}

export function pageUser(params?: any) {
  return request('/api/system/department/pageUser', {
    data: params,
    method: 'POST',
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function treeDepartment() {
  return request('/api/system/department/tree', {
    method: 'POST',
  }).then((resData) => {
    return resData.data;
  });
}

export async function queryDepartment(params?: any) {
  return request('/api/system/department/page', {
    data: params,
    method: 'POST',
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveDepartment(params?: any) {
  return request('/api/system/department/save', {
    data: { save: params },
    method: 'POST',
  });
}

export async function updateDepartment(params?: any) {
  return request('/api/system/department/update', {
    data: { update: params },
    method: 'POST',
  });
}

export async function deleteDepartment(params?: any) {
  return request('/api/system/department/delete', {
    data: { deleteId: params },
    method: 'POST',
  });
}
