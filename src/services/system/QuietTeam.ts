import type { QuietTeam } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';
import { DELETE, GET, PAGE, POST, PUT } from '@/utils/HttpUtils';

const base_path = '/api/system/team';

export function listTeamsByTeamName(team_name: string) {
  return GET<QuietTeam[]>(`${base_path}/list-teams-by-team-name`, { teamName: team_name });
}

export async function pageTeam(params?: any): Promise<Partial<RequestData<QuietTeam>>> {
  return PAGE<QuietTeam>(`${base_path}/page`, params);
}

export async function saveTeam(save: QuietTeam): Promise<QuietTeam> {
  return POST<QuietTeam>(`${base_path}`, save);
}

export async function updateTeam(update: QuietTeam): Promise<QuietTeam> {
  return PUT<QuietTeam>(`${base_path}`, update);
}

export async function deleteTeam(id: string) {
  await DELETE(`${base_path}/${id}`);
}
