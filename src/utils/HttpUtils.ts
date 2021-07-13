import { request } from '@@/plugin-request/request';
import qs from 'qs';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import type { Result } from '@/types/Result';

function GET<T>(
  url: string,
  params?: Record<string, unknown> | URLSearchParams | undefined,
): Promise<T> {
  return request<Result<T>>(url, {
    method: 'GET',
    params: new URLSearchParams(qs.stringify(params, { allowDots: true, arrayFormat: 'comma' })),
  }).then((resp) => resp.data);
}

function PAGE<T>(url: string, params: any): Promise<Partial<RequestData<T>>> {
  return GET<any>(url, { ...params, ...params.params }).then((resData: any) => {
    return { ...resData, data: resData.results };
  });
}

function POST<T>(url: string, data: any): Promise<T> {
  return request<Result<T>>(url, {
    method: 'POST',
    data,
  }).then((resp) => resp.data);
}

function DELETE(url: string) {
  request(url, {
    method: 'DELETE',
  });
}

function PUT<T>(url: string, data: any): Promise<T> {
  return request<Result<T>>(url, {
    method: 'PUT',
    data,
  }).then((resp) => resp.data);
}

export { GET, PAGE, POST, DELETE, PUT };