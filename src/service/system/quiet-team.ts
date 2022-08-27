import { DELETE, GET, PAGE, PageResult, POST, PUT } from '@/utils/request';
import { QuietTeam } from '@/service/system/type';

const base_path = '/system/team';

export function listTeams(parmas: {
  id?: string;
  team_user_id?: string;
  team_name?: string;
}) {
  return GET<QuietTeam[]>(`${base_path}/list-teams`, parmas);
}

export function getTeam(id: string) {
  return GET<QuietTeam>(`${base_path}/${id}`);
}

export async function pageTeam(
  params?: Record<string, unknown>
): Promise<PageResult<QuietTeam>> {
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
