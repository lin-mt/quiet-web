import React, { useState } from 'react';
import { getQueryParams } from '@/utils/getUrlParams';
import { Card, Empty } from '@arco-design/web-react';
import VersionPlanningContent from '@/pages/scrum/version-planning/version-planning-content';
import ScrumPlanningSelect from '@/components/scrum/ScrumPlanningSelect';

function VersionPlanning() {
  const query = getQueryParams();

  const [projectId, setProjectId] = useState(query.projectId);

  return (
    <Card>
      <ScrumPlanningSelect
        hideVersionSelect={true}
        onProjectChange={(id) => setProjectId(id)}
      />
      {projectId ? (
        <VersionPlanningContent projectId={projectId} />
      ) : (
        <Empty description={'请选择要规划的项目'} style={{ width: '100%' }} />
      )}
    </Card>
  );
}

export default VersionPlanning;
