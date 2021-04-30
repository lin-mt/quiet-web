import { request } from 'umi';

const apiPrefix = '/api/scrum/project';

export function saveProject(params?: any) {
  return request(`${apiPrefix}/save`, {
    data: { save: params },
    method: 'POST',
  });
}

export function updateProject(params?: any) {
  return request(`${apiPrefix}/update`, {
    data: { update: params },
    method: 'POST',
  });
}

export function deleteProject(params: string) {
  return request(`${apiPrefix}/delete`, {
    data: { deleteId: params },
    method: 'POST',
  });
}

export function allMyProjects() {
  return request(`${apiPrefix}/allMyProjects`, {
    method: 'POST',
  }).then((resData) => {
    return resData.data;
  });
}

export function findProjectInfo(id: string) {
  return request(`${apiPrefix}/projectInfo`, {
    method: 'POST',
    data: { id },
  }).then((resData) => {
    return resData.data;
  });
}

export function findProjectDetail(id: string): Promise<ScrumEntities.ScrumProjectDetail> {
  return request(`${apiPrefix}/detail`, {
    method: 'POST',
    data: { id },
  }).then((resData) => {
    return resData.data;
  });
}
