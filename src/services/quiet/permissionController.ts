// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新权限信息 PUT /permission */
export async function updatePermission(
  body: API.UpdatePermission,
  options?: { [key: string]: any },
) {
  return request<string>(`/api/permission`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增权限信息 POST /permission */
export async function addPermission(body: API.AddPermission, options?: { [key: string]: any }) {
  return request<string>(`/api/permission`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除权限 DELETE /permission */
export async function deletePermission(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePermissionParams,
  options?: { [key: string]: any },
) {
  return request<any>(`/api/permission`, {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页查询权限信息 GET /permission/page */
export async function pagePermission(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pagePermissionParams,
  options?: { [key: string]: any },
) {
  return request<API.PagedModelPermissionVO>(`/api/permission/page`, {
    method: 'GET',
    params: {
      ...params,
      pagePermission: undefined,
      ...params['pagePermission'],
    },
    ...(options || {}),
  });
}

/** 查询所有权限信息，返回树形结构 GET /permission/treeSelect */
export async function treePermission(options?: { [key: string]: any }) {
  return request<API.TreePermission[]>(`/api/permission/treeSelect`, {
    method: 'GET',
    ...(options || {}),
  });
}
