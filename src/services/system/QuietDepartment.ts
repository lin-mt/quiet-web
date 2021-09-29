import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietDepartment, QuietUser } from '@/services/system/EntityType';
import { DELETE, GET, PAGE, PAGE_RESULT, POST, PUT } from '@/utils/HttpUtils';

const baseUrl = '/api/system/department';

export function removeUsers(departmentId: string, userIds: string[]) {
  return POST(`${baseUrl}/removeUsers`, { id: departmentId, userIds });
}

export function addUsers(departmentId: string, userIds: string[]) {
  return POST(`${baseUrl}/addUsers`, { id: departmentId, userIds });
}

export function pageUser(params?: any): Promise<Partial<RequestData<QuietUser>>> {
  return PAGE_RESULT<QuietUser>(`${baseUrl}/pageUser`, params);
}

export async function treeDepartment(): Promise<QuietDepartment[]> {
  return GET<QuietDepartment[]>(`${baseUrl}/tree`);
}

export async function pageDepartment(params?: any): Promise<Partial<RequestData<QuietDepartment>>> {
  return PAGE<QuietDepartment>(`${baseUrl}/page`, params);
}

export async function saveDepartment(save: QuietDepartment): Promise<QuietDepartment> {
  return POST<QuietDepartment>(`${baseUrl}`, save);
}

export async function updateDepartment(update: QuietDepartment): Promise<QuietDepartment> {
  return PUT<QuietDepartment>(`${baseUrl}`, update);
}

export async function deleteDepartment(id: string) {
  await DELETE(`${baseUrl}/${id}`);
}
