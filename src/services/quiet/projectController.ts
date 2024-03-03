// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新项目 PUT /project */
export async function updateProject(body: API.UpdateProject, options?: { [key: string]: any }) {
  return request<string>(`/api/project`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加项目 POST /project */
export async function addProject(body: API.AddProject, options?: { [key: string]: any }) {
  return request<string>(`/api/project`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 项目详情 GET /project/${param0} */
export async function getProjectDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getProjectDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ProjectDetail>(`/api/project/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 删除项目 DELETE /project/${param0} */
export async function deleteProject(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteProjectParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/project/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新项目成员 PUT /project/members */
export async function updateProjectMembers(
  body: API.ProjectMember,
  options?: { [key: string]: any },
) {
  return request<any>(`/api/project/members`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页查询项目信息 GET /project/page */
export async function pageProject(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageProjectParams,
  options?: { [key: string]: any },
) {
  return request<API.PageProjectVO>(`/api/project/page`, {
    method: 'GET',
    params: {
      ...params,
      pageProjectFilter: undefined,
      ...params['pageProjectFilter'],
    },
    ...(options || {}),
  });
}
