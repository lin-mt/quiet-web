import { request } from 'umi';
import type { Result } from '@/types/Result';

export function listTeamsByTeamName(teamName: string) {
  return request<Result<SystemEntities.QuietTeam[]>>('/api/system/team/listTeamsByTeamName', {
    data: { params: { teamName } },
    method: 'POST',
  });
}

export async function queryTeam(params?: any) {
  return request('/api/system/team/page', {
    data: params,
    method: 'POST',
  }).then((resData) => {
    return { ...resData.data, data: resData.data.results };
  });
}

export async function saveTeam(params?: any) {
  return request('/api/system/team/save', {
    data: { save: params },
    method: 'POST',
  });
}

export async function updateTeam(params?: any) {
  return request('/api/system/team/update', {
    data: { update: params },
    method: 'POST',
  });
}

export async function deleteTeam(params?: any) {
  return request('/api/system/team/delete', {
    data: { deleteId: params },
    method: 'POST',
  });
}
