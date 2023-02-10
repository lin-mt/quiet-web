import { QuietDictType } from '@/service/system/type';
import { DELETE, GET, PAGE, PageResult, POST, PUT } from '@/utils/request';

const base_path = '/dict-type';

export async function pageDictType(
  params?: Record<string, unknown>
): Promise<PageResult<QuietDictType>> {
  return PAGE<QuietDictType>(`${base_path}/page`, params);
}

export async function findEnabledDictType(
  name?: string,
  ids?: string[]
): Promise<QuietDictType[]> {
  return GET<QuietDictType[]>(`${base_path}/enabled`, { name, ids });
}

export async function saveDictType(
  save: QuietDictType
): Promise<QuietDictType> {
  return POST<QuietDictType>(`${base_path}`, save);
}

export async function updateDictType(
  update: QuietDictType
): Promise<QuietDictType> {
  return PUT<QuietDictType>(`${base_path}`, update);
}

export async function deleteDictType(id: string) {
  await DELETE(`${base_path}/${id}`);
}
