import { request } from '@@/plugin-request/request';

const apiPrefix = '/api/scrum/taskStep';

export function getAllByTemplateId(param: string) {
  return request(`${apiPrefix}/getAllByTemplateId`, {
    data: { templateId: param },
    method: 'POST',
  });
}

export function saveTaskStep(params: ScrumEntities.ScrumTaskStep) {
  return request(`${apiPrefix}/save`, {
    data: { save: params },
    method: 'POST',
  });
}

export function updateTaskStep(params: ScrumEntities.ScrumTaskStep) {
  return request(`${apiPrefix}/update`, {
    data: { update: params },
    method: 'POST',
  });
}

export function deleteTaskStep(params: string) {
  return request(`${apiPrefix}/delete`, {
    data: { deleteId: params },
    method: 'POST',
  });
}

export function batchUpdateTaskStep(params: ScrumEntities.ScrumTaskStep[]) {
  return request(`${apiPrefix}/updateBatch`, {
    data: { updateBatch: params },
    method: 'POST',
  });
}
