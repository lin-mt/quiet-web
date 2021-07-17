import type { QuietTeam } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import { DELETE, GET, PAGE, POST, PUT } from '@/utils/HttpUtils';

const baseUrl = '/api/system/team';

export function listTeamsByTeamName(teamName: string) {
  return GET<QuietTeam[]>(`${baseUrl}/listTeamsByTeamName`, { teamName });
}

export async function pageTeam(params?: any): Promise<Partial<RequestData<QuietTeam>>> {
  return PAGE<QuietTeam>(`${baseUrl}/page`, params);
}

export async function saveTeam(save: QuietTeam): Promise<QuietTeam> {
  return POST<QuietTeam>(`${baseUrl}`, save);
}

export async function updateTeam(update: QuietTeam): Promise<QuietTeam> {
  return PUT<QuietTeam>(`${baseUrl}`, update);
}

export async function deleteTeam(id: string) {
  await DELETE(`${baseUrl}/${id}`);
}
