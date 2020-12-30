import { request } from 'umi';

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
