import type { QuietDictionary } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import { DELETE, GET, PAGE, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/system/dictionary';

export function listByTypeForSelect(type: string): Promise<QuietDictionary[]> {
  return GET<QuietDictionary[]>(`${base_path}/list-by-type-for-select`, { type });
}

export async function treeDictionaryByType(type: string | undefined): Promise<QuietDictionary[]> {
  return GET<QuietDictionary[]>(`${base_path}/tree-by-type`, { type });
}

export async function pageDictionary(params?: any): Promise<Partial<RequestData<QuietDictionary>>> {
  return PAGE<QuietDictionary>(`${base_path}/page`, params);
}

export async function saveDictionary(save: QuietDictionary): Promise<QuietDictionary> {
  return POST<QuietDictionary>(`${base_path}`, save);
}

export async function updateDictionary(update: QuietDictionary): Promise<QuietDictionary> {
  return PUT<QuietDictionary>(`${base_path}`, update);
}

export async function deleteDictionary(id: string) {
  await DELETE(`${base_path}/${id}`);
}
