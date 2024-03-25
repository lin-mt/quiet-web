// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新需求 PUT /requirement */
export async function updateRequirement(
  body: API.UpdateRequirement,
  options?: { [key: string]: any },
) {
  return request<string>(`/api/requirement`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加需求 POST /requirement */
export async function addRequirement(body: API.AddRequirement, options?: { [key: string]: any }) {
  return request<string>(`/api/requirement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除需求 DELETE /requirement/${param0} */
export async function deleteRequirement(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRequirementParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/requirement/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询需求 GET /requirement/list */
export async function listRequirement(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listRequirementParams,
  options?: { [key: string]: any },
) {
  return request<API.RequirementVO[]>(`/api/requirement/list`, {
    method: 'GET',
    params: {
      ...params,
      listRequirement: undefined,
      ...params['listRequirement'],
    },
    ...(options || {}),
  });
}

/** 查询需求 GET /requirement/listByIterationId */
export async function listRequirementByIterationId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listRequirementByIterationIdParams,
  options?: { [key: string]: any },
) {
  return request<API.RequirementVO[]>(`/api/requirement/listByIterationId`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 规划需求 PUT /requirement/planning */
export async function planningRequirement(
  body: API.PlanningRequirement,
  options?: { [key: string]: any },
) {
  return request<any>(`/api/requirement/planning`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
