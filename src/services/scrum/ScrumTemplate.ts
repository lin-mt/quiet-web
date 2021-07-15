import type { AllTemplate, ScrumTemplate } from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const apiPrefix = '/api/scrum/template';

export function listEnabledByName(name: string): Promise<ScrumTemplate[]> {
  return GET<ScrumTemplate[]>(`${apiPrefix}/listEnabledByName`, { name });
}

export function saveTemplate(save: ScrumTemplate): Promise<ScrumTemplate> {
  return POST<ScrumTemplate>(`${apiPrefix}`, save);
}

export function updateTemplate(update: ScrumTemplate): Promise<ScrumTemplate> {
  return PUT<ScrumTemplate>(`${apiPrefix}`, update);
}

export function deleteTemplate(id: string) {
  DELETE(`${apiPrefix}/${id}`);
}

export function allTemplates(): Promise<AllTemplate> {
  return GET<AllTemplate>(`${apiPrefix}/allTemplates`);
}

export function templateDetailInfo(id: string): Promise<ScrumTemplate> {
  return GET<ScrumTemplate>(`${apiPrefix}/${id}`);
}
