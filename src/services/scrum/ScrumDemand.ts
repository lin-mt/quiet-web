import { request } from 'umi';

const apiPrefix = '/api/scrum/demand';

export function findToBePlanned(
  projectId: string,
  offset: number,
  limit: number,
): Promise<ScrumEntities.ScrumDemand[]> {
  return request(`${apiPrefix}/scrollToBePlanned`, {
    method: 'POST',
    data: { id: projectId, offset, limit },
  }).then((resData) => {
    return resData.data;
  });
}
