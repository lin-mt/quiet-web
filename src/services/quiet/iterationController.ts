// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新项目迭代信息 PUT /iteration */
export async function updateIteration(body: API.UpdateIteration, options?: { [key: string]: any }) {
  return request<string>(`/api/iteration`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加项目迭代信息 POST /iteration */
export async function addIteration(body: API.AddIteration, options?: { [key: string]: any }) {
  return request<string>(`/api/iteration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取迭代详细信息 GET /iteration/${param0} */
export async function getIterationDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getIterationDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.IterationDetail>(`/api/iteration/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除项目迭代信息 DELETE /iteration/${param0} */
export async function deleteIteration(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteIterationParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/iteration/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
