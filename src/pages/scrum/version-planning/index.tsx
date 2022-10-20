import React, { useState } from 'react';
import { Card, Empty } from '@arco-design/web-react';
import VersionPlanningContent from '@/pages/scrum/version-planning/version-planning-content';
import ScrumPlanningSelect, {
  LocalParamKeys,
} from '@/components/scrum/ScrumPlanningSelect';

function VersionPlanning() {
  const [projectId, setProjectId] = useState<string>();

  return (
    <Card>
      <ScrumPlanningSelect
        hideVersionSelect={true}
        localParams={(params) => setProjectId(params.project_id)}
        localParamKey={LocalParamKeys.VERSION_PLANNING}
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
