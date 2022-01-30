import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietDepartment, QuietUser } from '@/services/system/EntityType';
import { DELETE, GET, PAGE, PAGE_RESULT, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/system/department';

export function removeUsers(department_id: string, user_ids: string[]) {
  return POST(`${base_path}/remove-users`, { id: department_id, userIds: user_ids });
}

export function addUsers(department_id: string, user_ids: string[]) {
  return POST(`${base_path}/add-users`, { id: department_id, userIds: user_ids });
}

export function pageUser(params?: any): Promise<Partial<RequestData<QuietUser>>> {
  return PAGE_RESULT<QuietUser>(`${base_path}/page-user`, params);
}

export async function treeDepartment(): Promise<QuietDepartment[]> {
  return GET<QuietDepartment[]>(`${base_path}/tree`);
}

export async function pageDepartment(params?: any): Promise<Partial<RequestData<QuietDepartment>>> {
  return PAGE<QuietDepartment>(`${base_path}/page`, params);
}

export async function saveDepartment(save: QuietDepartment): Promise<QuietDepartment> {
  return POST<QuietDepartment>(`${base_path}`, save);
}

export async function updateDepartment(update: QuietDepartment): Promise<QuietDepartment> {
  return PUT<QuietDepartment>(`${base_path}`, update);
}

export async function deleteDepartment(id: string) {
  await DELETE(`${base_path}/${id}`);
}
