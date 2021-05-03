import { request } from 'umi';
import type { Result } from '@/types/Result';

const apiPrefix = '/api/scrum/template';

export function listByName(name: string) {
  return request<Result<ScrumEntities.ScrumTemplate[]>>(`${apiPrefix}/listByName`, {
    data: { name },
    method: 'POST',
  });
}

export function saveTemplate(
  save: ScrumEntities.ScrumTemplate,
): Promise<ScrumEntities.ScrumTemplate> {
  return request<Result<ScrumEntities.ScrumTemplate>>(`${apiPrefix}/save`, {
    data: { save },
    method: 'POST',
  }).then((resp) => resp.data);
}

export function updateTemplate(
  update: ScrumEntities.ScrumTemplate,
): Promise<ScrumEntities.ScrumTemplate> {
  return request<Result<ScrumEntities.ScrumTemplate>>(`${apiPrefix}/update`, {
    data: { update },
    method: 'POST',
  }).then((resp) => resp.data);
}

export function deleteTemplate(params: string) {
  return request(`${apiPrefix}/delete`, {
    data: { deleteId: params },
    method: 'POST',
  });
}

export function allTemplates(): Promise<ScrumEntities.AllTemplate> {
  return request<Result<ScrumEntities.AllTemplate>>(`${apiPrefix}/allTemplates`, {
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
