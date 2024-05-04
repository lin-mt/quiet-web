// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新接口文档分组 PUT /apiDocsGroup */
export async function updateApiDocsGroup(
  body: API.UpdateApiDocsGroup,
  options?: { [key: string]: any },
) {
  return request<API.ApiDocsGroupVO>(`/apiDocsGroup`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增接口文档分组 POST /apiDocsGroup */
export async function addApiDocsGroup(
  body: API.SaveApiDocsGroup,
  options?: { [key: string]: any },
) {
  return request<string>(`/apiDocsGroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除接口文档分组 DELETE /apiDocsGroup/${param0} */
export async function deleteApiDocsGroup(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteApiDocsGroupParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/apiDocsGroup/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询项目接口文档信息 GET /apiDocsGroup/treeApiDocsGroupDetail */
export async function treeApiDocsGroupDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.treeApiDocsGroupDetailParams,
  options?: { [key: string]: any },
) {
  return request<API.ApiDocsGroupDetail[]>(`/apiDocsGroup/treeApiDocsGroupDetail`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
