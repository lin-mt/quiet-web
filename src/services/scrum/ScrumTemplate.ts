import { request } from 'umi';
import type { Result } from '@/types/Result';

const apiPrefix = '/api/scrum/template';

export function listByName(name: string) {
  return request<Result<ScrumEntities.ScrumTemplate[]>>(`${apiPrefix}/listByName`, {
    data: { name },
    method: 'POST',
  });
}

export function saveTemplate(params?: any) {
  return request(`${apiPrefix}/save`, {
    data: { save: params },
    method: 'POST',
  });
}

export function updateTemplate(params?: any) {
  return request(`${apiPrefix}/update`, {
    data: { update: params },
    method: 'POST',
  });
}

export function deleteTemplate(params: string) {
  return request(`${apiPrefix}/delete`, {
    data: { deleteId: params },
    method: 'POST',
  });
}

export async function allTemplates() {
  return request(`${apiPrefix}/allTemplates`, {
    method: 'POST',
  }).then((resData) => {
    return resData.data;
  });
}

export function templateDetailInfo(id: string) {
  return request(`${apiPrefix}/templateInfo`, {
    method: 'POST',
    data: { id },
  }).then((resData) => {
    return resData.data;
  });
}
