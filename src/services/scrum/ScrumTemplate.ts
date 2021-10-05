import type { AllTemplate, ScrumTemplate } from '@/services/scrum/EntitiyType';
import { DELETE, GET, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/scrum/template';

export function listEnabledByName(name: string): Promise<ScrumTemplate[]> {
  return GET<ScrumTemplate[]>(`${base_path}/list-enabled-by-name`, { name });
}

export function saveTemplate(save: ScrumTemplate): Promise<ScrumTemplate> {
  return POST<ScrumTemplate>(`${base_path}`, save);
}

export function updateTemplate(update: ScrumTemplate): Promise<ScrumTemplate> {
  return PUT<ScrumTemplate>(`${base_path}`, update);
}

export function deleteTemplate(id: string) {
  DELETE(`${base_path}/${id}`);
}

export function allTemplates(): Promise<AllTemplate> {
  return GET<AllTemplate>(`${base_path}/all-templates`);
}

export function templateDetailInfo(id: string): Promise<ScrumTemplate> {
  return GET<ScrumTemplate>(`${base_path}/${id}`);
}
