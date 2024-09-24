// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新接口文档 PUT /apiDocs */
export async function updateApiDocs(body: API.UpdateApiDocs, options?: { [key: string]: any }) {
  return request<string>(`/apiDocs`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增接口文档 POST /apiDocs */
export async function addApiDocs(body: API.SaveApiDocs, options?: { [key: string]: any }) {
  return request<string>(`/apiDocs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
