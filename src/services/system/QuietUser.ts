import { request } from 'umi';
import type { ReactText } from 'react';
import type { NoticeIconData, QuietUser, QuietUserRole } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import { DELETE, GET, PAGE, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/system/user';

export function listUsersByName(keyword: string): Promise<QuietUser[]> {
  return GET<QuietUser[]>(`${base_path}/list-users-by-name`, { keyword });
}

export async function pageUser(params?: any): Promise<Partial<RequestData<QuietUser>>> {
  return PAGE<QuietUser>(`${base_path}/page`, params);
}

export async function registeredUser(save: QuietUser): Promise<QuietUser> {
  return POST<QuietUser>(`${base_path}`, save);
}

export async function deleteUser(id: string) {
  await DELETE(`${base_path}/${id}`);
}

export async function updateUser(update: QuietUser): Promise<QuietUser> {
  return PUT<QuietUser>(`${base_path}`, update);
}

export async function getNotices(options?: Record<string, any>) {
  return request<SystemAPI.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryCurrent(): Promise<QuietUser> {
  return GET<QuietUser>(`${base_path}/current-user-info`).then((res) => {
    if (res && !res.avatar) {
      res.avatar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    }
    return res;
  });
}

export async function removeRole(id: string, role_id: string) {
  return POST(`${base_path}/remove-role`, { id, role_id });
}

export async function addRoles(
  user_roles: { user_id: string; role_id: ReactText }[],
): Promise<QuietUserRole> {
  return POST<QuietUserRole>(`${base_path}/add-roles`, { userRoles: user_roles });
}

export async function queryNotices(): Promise<any> {
  return request<{ data: NoticeIconData[] }>('/api/notices');
}
