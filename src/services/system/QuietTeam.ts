import { request } from 'umi';
import type { Result } from '@/types/Result';
import type { QuietTeam } from '@/services/system/EntityType';
import type { RequestData } from '@ant-design/pro-table/lib/typing';

export function listTeamsByTeamName(teamName: string) {
  return request<Result<QuietTeam[]>>('/api/system/team/listTeamsByTeamName', {
    method: 'POST',
    data: { params: { teamName } },
  });
}

export async function pageTeam(params?: any): Promise<Partial<RequestData<QuietTeam>>> {
  return request<Result<Partial<RequestData<QuietTeam>>>>('/api/system/team/page', {
    method: 'POST',
    data: params,
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveTeam(save: QuietTeam): Promise<QuietTeam> {
  return request<Result<QuietTeam>>('/api/system/team/save', {
    method: 'POST',
    data: { save },
  }).then((resp) => resp.data);
}

export async function updateTeam(update: QuietTeam): Promise<QuietTeam> {
  return request<Result<QuietTeam>>('/api/system/team/update', {
    method: 'POST',
    data: { update },
  }).then((resp) => resp.data);
}

export async function deleteTeam(deleteId: string) {
  return request('/api/system/team/delete', {
    method: 'POST',
    data: { deleteId },
  });
}
