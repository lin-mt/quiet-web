import { request } from '@@/plugin-request/request';

export function saveProject(params?: any) {
  return request('/api/scrum/project/save', {
    data: { save: params },
    method: 'POST',
  });
}

export function updateProject(params?: any) {
  return request('/api/scrum/project/update', {
    data: { update: params },
    method: 'POST',
  });
}

export function deleteProject(params: string) {
  return request('/api/scrum/project/delete', {
    data: { deleteId: params },
    method: 'POST',
  });
}

export async function allMyProjects() {
  return request('/api/scrum/project/allMyProjects', {
    method: 'POST',
  }).then((resData) => {
    return resData.data;
  });
}
