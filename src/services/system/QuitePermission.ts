import { request } from 'umi';

export async function queryPermission(params?: any) {
  return request('/api/system/permission/page', {
    data: params,
    method: 'POST',
  }).then(resData => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function savePermission(params?: any) {
  return request('/api/system/permission/save', {
    data: { save: params },
    method: 'POST',
  });
}

export async function updatePermission(params?: any) {
  return request('/api/system/permission/update', {
    data: { update: params },
    method: 'PUT',
  });
}

export async function deletePermission(params?: any) {
  return request('/api/system/permission/delete', {
    data: { deleteId: params },
    method: 'DELETE',
  });
}