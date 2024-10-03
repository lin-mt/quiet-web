// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新用户 PUT /user */
export async function updateUser(body: API.UpdateUser, options?: { [key: string]: any }) {
  return request<string>(`/api/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 DELETE /user */
export async function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserParams,
  options?: { [key: string]: any },
) {
  return request<any>(`/api/user`, {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取当前用户信息 GET /user/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>(`/api/user/current`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 查询用户拥有的角色ID GET /user/listRoles */
export async function listRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listRolesParams,
  options?: { [key: string]: any },
) {
  return request<string[]>(`/api/user/listRoles`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据用户名查询用户（10条数据） GET /user/listUser */
export async function listUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listUserParams,
  options?: { [key: string]: any },
) {
  return request<API.SimpleUser[]>(`/api/user/listUser`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户登陆 POST /user/login */
export async function login(body: API.UserDTO, options?: { [key: string]: any }) {
  return request<string>(`/api/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页查询用户 GET /user/page */
export async function pageUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageUserParams,
  options?: { [key: string]: any },
) {
  return request<API.PagedModelUserVO>(`/api/user/page`, {
    method: 'GET',
    params: {
      ...params,
      pageUser: undefined,
      ...params['pageUser'],
    },
    ...(options || {}),
  });
}

/** 注册用户 POST /user/registration */
export async function registration(body: API.UserDTO, options?: { [key: string]: any }) {
  return request<string>(`/api/user/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户角色信息 PUT /user/updateRoles */
export async function updateRoles(body: API.UserRoles, options?: { [key: string]: any }) {
  return request<any>(`/api/user/updateRoles`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
