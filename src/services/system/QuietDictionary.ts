import type { QuietDictionary } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import { DELETE, GET, PAGE, POST, PUT } from '@/utils/HttpUtils';

const baseUrl = '/api/system/dictionary';

export function listByTypeForSelect(type: string): Promise<QuietDictionary[]> {
  return GET<QuietDictionary[]>(`${baseUrl}/listByTypeForSelect`, { type });
}

export async function treeDictionaryByType(type: string | undefined): Promise<QuietDictionary[]> {
  return GET<QuietDictionary[]>(`${baseUrl}/treeByType`, { type });
}

export async function pageDictionary(params?: any): Promise<Partial<RequestData<QuietDictionary>>> {
  return PAGE<QuietDictionary>(`${baseUrl}/page`, params);
}

export async function saveDictionary(save: QuietDictionary): Promise<QuietDictionary> {
  return POST<QuietDictionary>(`${baseUrl}`, save);
}

export async function updateDictionary(update: QuietDictionary): Promise<QuietDictionary> {
  return PUT<QuietDictionary>(`${baseUrl}`, update);
}

export async function deleteDictionary(id: string) {
  await DELETE(`${baseUrl}/${id}`);
}
