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

/** 删除模板 DELETE /template/${param0} */
export async function deleteTemplate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteTemplateParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/template/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询模板 GET /template/list */
export async function listTemplate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listTemplateParams,
  options?: { [key: string]: any },
) {
  return request<API.SimpleTemplate[]>(`/api/template/list`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页查询模板 GET /template/page */
export async function pageTemplate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageTemplateParams,
  options?: { [key: string]: any },
) {
  return request<API.PageTemplateVO>(`/api/template/page`, {
    method: 'GET',
    params: {
      ...params,
      pageTemplate: undefined,
      ...params['pageTemplate'],
    },
    ...(options || {}),
  });
}
