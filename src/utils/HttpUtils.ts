import { request } from '@@/plugin-request/request';

function GET<T>(
  url: string,
  params?: Record<string, unknown> | URLSearchParams | undefined,
): Promise<T> {
  return request<T>(url, {
    method: 'GET',
    params,
  });
}

function POST<T>(url: string, data: any): Promise<T> {
  return request<T>(url, {
    method: 'POST',
    data,
  });
}

function DELETE(url: string) {
  request(url, {
    method: 'DELETE',
  });
}

function PUT<T>(url: string, data: any): Promise<T> {
  return request<T>(url, {
    method: 'PUT',
    data,
  });
}

export { GET, POST, DELETE, PUT };
