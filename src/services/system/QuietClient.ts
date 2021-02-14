import {request} from 'umi';

export function removeClientScope(id: string, scope: string) {
  return request('/api/system/client/removeClientScope', {
    data: {id, clientScope: scope},
    method: 'POST',
  });
}

export function removeClientAuthorizedGrantType(id: string, authorizedGrantType: string) {
  return request('/api/system/client/removeClientAuthorizedGrantType', {
    data: {id, clientAuthorizedGrantType: authorizedGrantType},
    method: 'POST',
  });
}


export async function queryClient(params?: any) {
  return request('/api/system/client/page', {
    data: params,
    method: 'POST',
  }).then((resData) => {
    return {...resData.data, data: resData.data.results};
  });
}

export async function saveClient(params?: any) {
  return request('/api/system/client/save', {
    data: {save: params},
    method: 'POST',
  });
}

export async function updateClient(params?: any) {
  return request('/api/system/client/update', {
    data: {update: params},
    method: 'POST',
  });
}

export async function deleteClient(params?: any) {
  return request('/api/system/client/delete', {
    data: {deleteId: params},
    method: 'POST',
  });
}
