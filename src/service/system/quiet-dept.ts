import { DELETE, GET, PAGE, PageResult, POST, PUT } from '@/utils/request';
import { QuietDept } from '@/service/system/type';

const base_path = '/system/dept';

export function removeUsers(department_id: string, user_ids: string[]) {
  return POST(`${base_path}/remove-users`, {
    id: department_id,
    userIds: user_ids,
  });
}

export function addUsers(department_id: string, user_ids: string[]) {
  return POST(`${base_path}/add-users`, {
    id: department_id,
    userIds: user_ids,
  });
}

export async function treeDept(): Promise<QuietDept[]> {
  return GET<QuietDept[]>(`${base_path}/tree`);
}

export async function pageDept(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>
): Promise<PageResult<QuietDept>> {
  return PAGE<QuietDept>(`${base_path}/page`, params);
}

export async function saveDept(save: QuietDept): Promise<QuietDept> {
  return POST<QuietDept>(`${base_path}`, save);
}

export async function updateDept(update: QuietDept): Promise<QuietDept> {
  return PUT<QuietDept>(`${base_path}`, update);
}

export async function deleteDept(id: string) {
  await DELETE(`${base_path}/${id}`);
}
