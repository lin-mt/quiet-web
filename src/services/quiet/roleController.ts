// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新角色 PUT /role */
export async function updateRole(body: API.UpdateRole, options?: { [key: string]: any }) {
  return request<string>(`/api/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增角色 POST /role */
export async function addRole(body: API.AddRole, options?: { [key: string]: any }) {
  return request<string>(`/api/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除角色 DELETE /role */
export async function deleteRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRoleParams,
  options?: { [key: string]: any },
) {
  return request<any>(`/api/role`, {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询角色拥有的权限ID GET /role/listPermission */
export async function listPermission(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listPermissionParams,
  options?: { [key: string]: any },
) {
  return request<string[]>(`/api/role/listPermission`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页查询角色信息 GET /role/page */
export async function pageRole(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageRoleParams,
  options?: { [key: string]: any },
) {
  return request<API.PageRoleVO>(`/api/role/page`, {
    method: 'GET',
    params: {
      ...params,
      pageRole: undefined,
      ...params['pageRole'],
    },
    ...(options || {}),
  });
}

/** 查询所有角色信息，返回树形结构 GET /role/treeSelect */
export async function treeRoles(options?: { [key: string]: any }) {
  return request<API.TreeRole[]>(`/api/role/treeSelect`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新角色权限信息 PUT /role/updatePermissions */
export async function updatePermissions(
  body: API.RolePermissions,
  options?: { [key: string]: any },
) {
  return request<any>(`/api/role/updatePermissions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
