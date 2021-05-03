import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { QuietDictionary } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';

export function listByTypeForSelect(type: string): Promise<QuietDictionary[]> {
  return request<Result<QuietDictionary[]>>('/api/system/dictionary/listByTypeForSelect', {
    method: 'POST',
    data: { type },
  }).then((resp) => resp.data);
}

export async function treeDictionaryByType(type: string | undefined): Promise<QuietDictionary[]> {
  return request<Result<QuietDictionary[]>>('/api/system/dictionary/treeByType', {
    method: 'POST',
    data: { type },
  }).then((resp) => resp.data);
}

export async function pageDictionary(params?: any): Promise<Partial<RequestData<QuietDictionary>>> {
  return request<Result<Partial<RequestData<QuietDictionary>>>>('/api/system/dictionary/page', {
    method: 'POST',
    data: params,
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveDictionary(save: QuietDictionary): Promise<QuietDictionary> {
  return request<Result<QuietDictionary>>('/api/system/dictionary/save', {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export async function updateDictionary(update: QuietDictionary): Promise<QuietDictionary> {
  return request<Result<QuietDictionary>>('/api/system/dictionary/update', {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export async function deleteDictionary(deleteId: string) {
  return request('/api/system/dictionary/delete', {
    method: 'POST',
    data: { deleteId },
  });
}
