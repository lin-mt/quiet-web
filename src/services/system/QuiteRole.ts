import { request } from 'umi';

export async function queryRole(params?: any) {
  return request('/api/system/role/page', {
    data: params,
    method: 'POST',
  }).then(resData => {
    return { ...resData.data, data: resData.data.results };
  });
}
