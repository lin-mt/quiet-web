import { request } from '@@/plugin-request/request';

export function saveTemplate(params?: any) {
  return request('/api/scrum/template/save', {
    data: { save: params },
    method: 'POST',
  });
}

export function updateTemplate(params?: any) {
  return request('/api/scrum/template/update', {
    data: { update: params },
    method: 'POST',
  });
}

export function deleteTemplate(params: string) {
  return request('/api/scrum/template/delete', {
    data: { deleteId: params },
    method: 'POST',
  });
}

export async function allTemplates() {
  return request('/api/scrum/template/allTemplates', {
    method: 'POST',
  }).then((resData) => {
    return resData.data;
  });
}
