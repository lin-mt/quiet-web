import { QuietRole } from '@/service/system/type';
import { DELETE, GET, PAGE, PageResult, POST, PUT } from '@/utils/request';

const base_path = '/role';

export async function treeRole(): Promise<QuietRole[]> {
  return GET<QuietRole[]>(`${base_path}/tree`);
}

export async function pageRole(
  params?: Record<string, unknown>
): Promise<PageResult<QuietRole>> {
  return PAGE<QuietRole>(`${base_path}/page`, params);
}

export async function saveRole(save: QuietRole): Promise<QuietRole> {
  return POST<QuietRole>(`${base_path}`, save);
}

export async function updateRole(update: QuietRole): Promise<QuietRole> {
  return PUT<QuietRole>(`${base_path}`, update);
}

export async function deleteRole(id: string) {
  await DELETE(`${base_path}/${id}`);
}
