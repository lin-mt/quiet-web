import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { ReactText } from 'react';
import type { NoticeIconData, QuietUser, QuietUserRole } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import { GET } from '@/utils/HttpUtils';

const baseUrl = '/api/system/user';

export function listUsersByName(name: string): Promise<QuietUser[]> {
  return request<Result<QuietUser[]>>(`${baseUrl}/listUsersByName`, {
    method: 'POST',
    data: { name },
  }).then((resp) => resp.data);
}

export async function pageUser(params?: any): Promise<Partial<RequestData<QuietUser>>> {
  return request<Result<Partial<RequestData<QuietUser>>>>(`${baseUrl}/page`, {
    method: 'POST',
    data: params,
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function registeredUser(save: QuietUser): Promise<QuietUser> {
  return request<Result<QuietUser>>(`${baseUrl}/registered`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export async function deleteUser(deleteId: string) {
  request(`${baseUrl}/delete`, {
    method: 'POST',
    data: { deleteId },
  });
}

export async function updateUser(update: QuietUser): Promise<QuietUser> {
  return request<Result<QuietUser>>(`${baseUrl}/update`, {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export async function getNotices(options?: Record<string, any>) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryCurrent(): Promise<QuietUser> {
  return GET<Result<QuietUser>>(`${baseUrl}/currentUserInfo`).then((res) => {
    if (res && res.data && !res.data.avatar) {
      res.data.avatar =
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
    }
    return res.data;
  });
}

export async function removeRole(userId: string, roleId: string) {
  return request(`${baseUrl}/removeRole`, {
    data: { params: { userId, roleId } },
    method: 'POST',
  });
}

export async function addRoles(
  saveBatch: { userId: string; roleId: ReactText }[],
): Promise<QuietUserRole> {
  return request<Result<QuietUserRole>>(`${baseUrl}/addRoles`, {
    method: 'POST',
    data: { saveBatch },
  }).then((resp) => resp.data);
}

export async function queryNotices(): Promise<any> {
  return request<{ data: NoticeIconData[] }>('/api/notices');
}
