// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 更新任务 PUT /task */
export async function updateTask(body: API.UpdateTask, options?: { [key: string]: any }) {
  return request<string>(`/api/task`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新建任务 POST /task */
export async function addTask(body: API.AddTask, options?: { [key: string]: any }) {
  return request<string>(`/api/task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除任务 DELETE /task/${param0} */
export async function deleteTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteTaskParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/task/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 移动任务 PUT /task/moveTask/${param0} */
export async function moveTask(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.moveTaskParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/task/moveTask/${param0}`, {
    method: 'PUT',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}
