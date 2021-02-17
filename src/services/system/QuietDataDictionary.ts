import { request } from 'umi';

export async function treeDataDictionaryByType(params?: any) {
  return request('/api/system/dataDictionary/treeByType', {
    data: { type: params },
    method: 'POST',
  }).then((resData) => {
    return resData.data;
  });
}

export async function queryDataDictionary(params?: any) {
  return request('/api/system/dataDictionary/page', {
    data: params,
    method: 'POST',
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveDataDictionary(params?: any) {
  return request('/api/system/dataDictionary/save', {
    data: { save: params },
    method: 'POST',
  });
}

export async function updateDataDictionary(params?: any) {
  return request('/api/system/dataDictionary/update', {
    data: { update: params },
    method: 'POST',
  });
}

export async function deleteDataDictionary(params?: any) {
  return request('/api/system/dataDictionary/delete', {
    data: { deleteId: params },
    method: 'POST',
  });
}
