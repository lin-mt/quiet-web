// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新模板 PUT /template */
export async function updateTemplate(body: API.UpdateTemplate, options?: { [key: string]: any }) {
  return request<string>(`/api/template`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加模板 POST /template */
export async function addTemplate(body: API.AddTemplate, options?: { [key: string]: any }) {
  return request<string>(`/api/template`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取模板详情 GET /template/${param0} */
export async function getTemplateDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTemplateDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.TemplateDetail>(`/api/template/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
