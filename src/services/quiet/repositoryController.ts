// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新仓库 PUT /repository */
export async function updateRepository(
  body: API.UpdateRepository,
  options?: { [key: string]: any },
) {
  return request<string>(`/api/repository`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新增仓库 POST /repository */
export async function addRepository(body: API.AddRepository, options?: { [key: string]: any }) {
  return request<string>(`/api/repository`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除仓库 DELETE /repository/${param0} */
export async function deleteRepository(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRepositoryParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/repository/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询仓库 GET /repository/list */
export async function listRepository(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listRepositoryParams,
  options?: { [key: string]: any },
) {
  return request<API.RepositoryVO[]>(`/api/repository/list`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 分页查询仓库列表 GET /repository/page */
export async function pageRepository(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageRepositoryParams,
  options?: { [key: string]: any },
) {
  return request<API.PagedModelRepositoryVO>(`/api/repository/page`, {
    method: 'GET',
    params: {
      ...params,
      pageRepository: undefined,
      ...params['pageRepository'],
    },
    ...(options || {}),
  });
}
