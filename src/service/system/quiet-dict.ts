import { QuietDict } from '@/service/system/type';
import { DELETE, GET, PAGE, PageResult, POST, PUT } from '@/utils/request';

const base_path = '/system/dict';

export async function pageDict(
  params?: Record<string, unknown>
): Promise<PageResult<QuietDict>> {
  return PAGE<QuietDict>(`${base_path}/page`, params);
}

export async function findEnabledDict(
  type_id?: string,
  service_id?: string,
  type_key?: string
): Promise<QuietDict[]> {
  return GET<QuietDict[]>(`${base_path}/enabled`, {
    type_id,
    service_id,
    type_key,
  });
}

export async function saveDict(save: QuietDict): Promise<QuietDict> {
  return POST<QuietDict>(`${base_path}`, save);
}

export async function updateDict(update: QuietDict): Promise<QuietDict> {
  return PUT<QuietDict>(`${base_path}`, update);
}

export async function deleteDict(id: string) {
  await DELETE(`${base_path}/${id}`);
}
