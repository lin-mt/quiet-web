import { QuietUser, QuietUserRole } from '@/service/system/type';
import { DELETE, GET, PAGE, PageResult, POST, PUT } from '@/utils/request';

const base_path = '/system/user';

export function listUsers(
  keyword?: string,
  user_ids?: string[]
): Promise<QuietUser[]> {
  return GET<QuietUser[]>(`${base_path}/list-users`, { keyword, user_ids });
}

export async function pageUser(
  params?: Record<string, unknown>
): Promise<PageResult<QuietUser>> {
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

export async function queryCurrent(): Promise<QuietUser> {
  return GET<QuietUser>(`${base_path}/current-user-info`);
}

export async function getUser(id: string): Promise<QuietUser> {
  return GET<QuietUser>(`${base_path}/${id}`);
}

export async function removeRole(id: string, role_id: string) {
  return POST(`${base_path}/remove-role`, { id, role_id });
}

export async function addRoles(
  user_roles: { user_id: string; role_id: string }[]
): Promise<QuietUserRole> {
  return POST<QuietUserRole>(`${base_path}/add-roles`, {
    user_roles: user_roles,
  });
}

export async function updateRoles(
  user_id: string,
  role_ids: string[]
): Promise<void> {
  return POST<void>(`${base_path}/update-roles/${user_id}`, role_ids);
}
