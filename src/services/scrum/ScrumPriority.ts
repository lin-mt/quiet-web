import { request } from 'umi';

const apiPrefix = '/api/scrum/priority';

export function getAllByTemplateId(param: string) {
  return request(`${apiPrefix}/getAllByTemplateId`, {
    data: { templateId: param },
    method: 'POST',
  });
}

export function savePriority(params: ScrumEntities.ScrumPriority) {
  return request(`${apiPrefix}/save`, {
    data: { save: params },
    method: 'POST',
  });
}

export function updatePriority(params: ScrumEntities.ScrumPriority) {
  return request(`${apiPrefix}/update`, {
    data: { update: params },
    method: 'POST',
  });
}

export function deletePriority(params: string) {
  return request(`${apiPrefix}/delete`, {
    data: { deleteId: params },
    method: 'POST',
  });
}

export function batchUpdatePriorities(params: ScrumEntities.ScrumPriority[]) {
  return request(`${apiPrefix}/updateBatch`, {
    data: { updateBatch: params },
    method: 'POST',
  });
}
