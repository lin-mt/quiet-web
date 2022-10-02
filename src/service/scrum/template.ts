import { ScrumTemplate } from '@/service/scrum/type';
import { DELETE, GET, POST, PUT } from '@/utils/request';

const base_path = '/scrum/template';

export function saveTemplate(save: ScrumTemplate): Promise<ScrumTemplate> {
  return POST<ScrumTemplate>(`${base_path}`, save);
}

export function enabledTemplate(params: {
  id: string;
  enabled: boolean;
}): Promise<ScrumTemplate> {
  return POST<ScrumTemplate>(`${base_path}/enabled`, null, params);
}

export function updateTemplate(update: ScrumTemplate): Promise<ScrumTemplate> {
  return PUT<ScrumTemplate>(`${base_path}`, update);
}

export function deleteTemplate(id: string): Promise<void> {
  return DELETE(`${base_path}/${id}`);
}

export function listTemplate(parmas: {
  id?: string;
  name?: string;
  enabled?: boolean;
  limit?: number | string;
}): Promise<ScrumTemplate[]> {
  return GET<ScrumTemplate[]>(`${base_path}/list`, parmas);
}

export function getTemplateDetail(id: string): Promise<ScrumTemplate> {
  return GET<ScrumTemplate>(`${base_path}/${id}`);
}
