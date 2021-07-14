import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { QuietRoute } from '@/services/system/EntityType';
import { DELETE, PAGE, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/system/route';

export function publishRoute(environment: string) {
  POST(`${apiPrefix}/publishRoute`, { environment }).then((resp) => {
    if (resp) {
      // noinspection JSIgnoredPromiseFromCall
      POST('/api/actuator/gateway/refresh');
    }
  });
}

export function removePredicate(id: string, predicate: string) {
  return POST(`${apiPrefix}/removePredicate`, { id, routePredicate: predicate });
}

export function removeFilter(id: string, filter: string) {
  return POST(`${apiPrefix}/removeFilter`, { id, routeFilter: filter });
}

export async function pageRoute(params?: any): Promise<Partial<RequestData<QuietRoute>>> {
  return PAGE<QuietRoute>(`${apiPrefix}/page`, params);
}

export async function saveRoute(save: QuietRoute): Promise<QuietRoute> {
  return POST<QuietRoute>(`${apiPrefix}`, save);
}

export async function updateRoute(update: QuietRoute): Promise<QuietRoute> {
  return PUT<QuietRoute>(`${apiPrefix}`, update);
}

export async function deleteRoute(id: string) {
  return DELETE(`${apiPrefix}/${id}`);
}
