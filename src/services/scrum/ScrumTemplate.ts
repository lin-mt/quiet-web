import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { AllTemplate, ScrumTemplate } from '@/services/scrum/EntitiyType';

const apiPrefix = '/api/scrum/template';

export function listEnabledByName(name: string): Promise<ScrumTemplate[]> {
  return request<Result<ScrumTemplate[]>>(`${apiPrefix}/listEnabledByName`, {
    method: 'POST',
    data: { name },
  }).then((resp) => resp.data);
}

export function saveTemplate(save: ScrumTemplate): Promise<ScrumTemplate> {
  return request<Result<ScrumTemplate>>(`${apiPrefix}/save`, {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export function updateTemplate(update: ScrumTemplate): Promise<ScrumTemplate> {
  return request<Result<ScrumTemplate>>(`${apiPrefix}/update`, {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export function deleteTemplate(params: string) {
  return request(`${apiPrefix}/delete`, {
    method: 'POST',
    data: { deleteId: params },
  });
}

export function allTemplates(): Promise<AllTemplate> {
  return request<Result<AllTemplate>>(`${apiPrefix}/allTemplates`, {
    method: 'POST',
  }).then((resp) => resp.data);
}

export function templateDetailInfo(id: string): Promise<ScrumTemplate> {
  return request<Result<ScrumTemplate>>(`${apiPrefix}/templateInfo`, {
    method: 'POST',
    data: { id },
  }).then((resp) => resp.data);
}
