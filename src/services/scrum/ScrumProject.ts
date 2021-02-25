import { request } from '@@/plugin-request/request';

export async function saveProject(params?: any) {
  return request('/api/scrum/project/save', {
    data: { save: params },
    method: 'POST',
  });
}

export async function updateProject(params?: any) {
  return request('/api/scrum/project/update', {
    data: { update: params },
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
