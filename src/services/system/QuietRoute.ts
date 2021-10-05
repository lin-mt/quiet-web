import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietRoute } from '@/services/system/EntityType';
import { DELETE, PAGE, POST, PUT } from '@/utils/HttpUtils';
import { ResultType } from '@/types/Result';

const base_path = '/api/system/route';

export function publishRoute(environment: string) {
  POST(`${base_path}/publish-route`, { environment }).then((resp: any) => {
    if (resp.result === ResultType.SUCCESS) {
      // noinspection JSIgnoredPromiseFromCall
      POST('/api/actuator/gateway/refresh');
    }
  });
}

export function removePredicate(id: string, predicate: string) {
  return POST(`${base_path}/remove-predicate`, { id, route_predicate: predicate });
}

export function removeFilter(id: string, filter: string) {
  return POST(`${base_path}/remove-filter`, { id, route_filter: filter });
}

export async function pageRoute(params?: any): Promise<Partial<RequestData<QuietRoute>>> {
  return PAGE<QuietRoute>(`${base_path}/page`, params);
}

export async function saveRoute(save: QuietRoute): Promise<QuietRoute> {
  return POST<QuietRoute>(`${base_path}`, save);
}

export async function updateRoute(update: QuietRoute): Promise<QuietRoute> {
  return PUT<QuietRoute>(`${base_path}`, update);
}

export async function deleteRoute(id: string) {
  await DELETE(`${base_path}/${id}`);
}
