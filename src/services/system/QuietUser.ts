import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { ReactText } from 'react';

export function listUsersByName(name: string) {
  return request<Result<SystemEntities.QuietUser[]>>('/api/system/user/listUsersByName', {
    data: { name },
    method: 'POST',
  });
}

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
    method: 'POST',
  });
}

export async function updateUser(params?: any) {
  return request('/api/system/user/update', {
    data: { update: params },
    method: 'POST',
  });
}

export async function queryCurrent() {
  return request<Result<SystemEntities.QuietUser>>('/api/system/user/currentUserInfo', {
    method: 'POSt',
  }).then((res) => {
    if (res && res.data && !res.data.avatar) {
      res.data.avatar =
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    }
    return res;
  });
}

export async function removeRole(userId: string, roleId: string) {
  return request('/api/system/user/removeRole', {
    data: { params: { userId, roleId } },
    method: 'POST',
  });
}

export async function addRoles(userRoles: { userId: string | null; roleId: ReactText }[]) {
  return request('/api/system/user/addRoles', {
    data: { saveBatch: userRoles },
    method: 'POST',
  });
}

export async function queryNotices(): Promise<any> {
  return request<{ data: SystemEntities.NoticeIconData[] }>('/api/notices');
}
