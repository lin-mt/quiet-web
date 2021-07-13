import { request } from 'umi';
import type { ReactText } from 'react';
import type { NoticeIconData, QuietUser, QuietUserRole } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import { DELETE, GET, PAGE, POST, PUT } from '@/utils/HttpUtils';

const baseUrl = '/api/system/user';

export function listUsersByName(keyword: string): Promise<QuietUser[]> {
  return GET<QuietUser[]>(`${baseUrl}/listUsersByName`, { keyword });
}

export async function pageUser(params?: any): Promise<Partial<RequestData<QuietUser>>> {
  return PAGE<QuietUser>(`${baseUrl}/page`, params);
}

export async function registeredUser(save: QuietUser): Promise<QuietUser> {
  return POST<QuietUser>(`${baseUrl}`, save);
}

export async function deleteUser(id: string) {
  DELETE(`${baseUrl}/${id}`);
}

export async function updateUser(update: QuietUser): Promise<QuietUser> {
  return PUT<QuietUser>(`${baseUrl}`, update);
}

export async function getNotices(options?: Record<string, any>) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryCurrent(): Promise<QuietUser> {
  return GET<QuietUser>(`${baseUrl}/currentUserInfo`).then((res) => {
    if (res && !res.avatar) {
      res.avatar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    }
    return res;
  });
}

export async function removeRole(id: string, roleId: string) {
  return POST(`${baseUrl}/removeRole`, { id, roleId });
}

export async function addRoles(
  userRoles: { userId: string; roleId: ReactText }[],
): Promise<QuietUserRole> {
  return POST<QuietUserRole>(`${baseUrl}/addRoles`, { userRoles });
}

export async function queryNotices(): Promise<any> {
  return request<{ data: NoticeIconData[] }>('/api/notices');
}
