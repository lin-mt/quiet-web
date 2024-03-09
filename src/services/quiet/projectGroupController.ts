// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新项目组信息 PUT /projectGroup */
export async function updateProjectGroup(
  body: API.UpdateProjectGroup,
  options?: { [key: string]: any },
) {
  return request<string>(`/api/projectGroup`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增项目组信息 POST /projectGroup */
export async function addProjectGroup(body: API.AddProjectGroup, options?: { [key: string]: any }) {
  return request<string>(`/api/projectGroup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除项目组信息 DELETE /projectGroup/${param0} */
export async function deleteProjectGroup(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteProjectGroupParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/projectGroup/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新项目组成员 PUT /projectGroup/members */
export async function updateProjectGroupMembers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateProjectGroupMembersParams,
  options?: { [key: string]: any },
) {
  return request<any>(`/api/projectGroup/members`, {
    method: 'PUT',
    params: {
      ...params,
      member: undefined,
      ...params['member'],
    },
    ...(options || {}),
  });
}

/** 分页查询项目组信息 GET /projectGroup/page */
export async function pageProjectGroup(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageProjectGroupParams,
  options?: { [key: string]: any },
) {
  return request<API.PageProjectGroupVO>(`/api/projectGroup/page`, {
    method: 'GET',
    params: {
      ...params,
      page: undefined,
      ...params['page'],
    },
    ...(options || {}),
  });
}
