import { request } from 'umi';

export async function treeDictionaryByType(params?: any) {
  return request('/api/system/dictionary/treeByType', {
    data: { type: params },
    method: 'POST',
  }).then((resData) => {
    return resData.data;
  });
}

export async function queryDictionary(params?: any) {
  return request('/api/system/dictionary/page', {
    data: params,
    method: 'POST',
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveDictionary(params?: any) {
  return request('/api/system/dictionary/save', {
    data: { save: params },
    method: 'POST',
  });
}

export async function updateDictionary(params?: any) {
  return request('/api/system/dictionary/update', {
    data: { update: params },
    method: 'POST',
  });
}

export async function deleteDictionary(params?: any) {
  return request('/api/system/dictionary/delete', {
    data: { deleteId: params },
    method: 'POST',
  });
}
