import { request } from 'umi';

export async function treeRole() {
  return request('/api/system/role/tree', {
    method: 'POST',
  }).then((resData) => {
    return resData.data;
  });
}

export async function queryRole(params?: any) {
  return request('/api/system/role/page', {
    data: params,
    method: 'POST',
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveRole(params?: any) {
  return request('/api/system/role/save', {
    data: { save: params },
    method: 'POST',
  });
}

export async function updateRole(params?: any) {
  return request('/api/system/role/update', {
    data: { update: params },
    method: 'POST',
  });
}

export async function deleteRole(params?: any) {
  return request('/api/system/role/delete', {
    data: { deleteId: params },
    method: 'POST',
  });
}
