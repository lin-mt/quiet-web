import { request } from 'umi';
import type { Result } from '@/types/Result';

export async function queryUser(params?: any) {
  return request('/api/system/user/page', {
    data: params,
    method: 'POST',
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function registeredUser(params?: any) {
  return request('/api/system/user/registered', {
    data: { save: params },
    method: 'POST',
  });
}

export async function deleteUser(params?: any) {
  request('/api/system/user/delete', {
    data: { deleteId: params },
    method: 'DELETE',
  });
}

export async function updateUser(params?: any) {
  return request('/api/system/user/update', {
    data: { update: params },
    method: 'PUT',
  });
}

export async function queryCurrent() {
  return request<Result<SystemEntities.QuietUser>>('/api/system/user/currentUserInfo').then(
    (res) => {
      if (res && res.data && !res.data.avatar) {
        res.data.avatar =
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
      }
      return res;
    },
  );
}

export async function queryNotices(): Promise<any> {
  return request<{ data: SystemEntities.NoticeIconData[] }>('/api/notices');
}
