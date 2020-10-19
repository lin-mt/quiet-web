import { request } from 'umi';

export async function queryPermission(params?: any) {
  return request('/api/system/permission/page', {
    data: params,
    method: 'POST',
  }).then(resData => {
    return { ...resData.data, data: resData.data.results };
  });
}
