import { request } from 'umi';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietRoute } from '@/services/system/EntityType';
import type { Result } from '@/types/Result';

const apiPrefix = '/api/system/route';

export function publishRoute(environment: string) {
  request(`${apiPrefix}/publishRoute`, {
    method: 'POST',
    data: { environment },
  }).then(() => {
    request('/api/actuator/gateway/refresh', {
      method: 'POST',
    });
  });
}

export function removePredicate(id: string, predicate: string) {
  return request(`${apiPrefix}/removePredicate`, {
    method: 'POST',
    data: { id, predicate },
  });
}

export function removeFilter(id: string, filter: string) {
  return request(`${apiPrefix}/removeFilter`, {
    method: 'POST',
    data: { id, filter },
  });
}

export async function pageRoute(params?: any): Promise<Partial<RequestData<QuietRoute>>> {
  return request<Result<Partial<RequestData<QuietRoute>>>>(`${apiPrefix}/page`, {
    method: 'POST',
    data: params,
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveRoute(save: QuietRoute): Promise<QuietRoute> {
  return request<Result<QuietRoute>>(`${apiPrefix}/save`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export async function updateRoute(update: QuietRoute): Promise<QuietRoute> {
  return request<Result<QuietRoute>>(`${apiPrefix}/update`, {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export async function deleteRoute(deleteId: string) {
  return request(`${apiPrefix}/delete`, {
    method: 'POST',
    data: { deleteId },
  });
}
