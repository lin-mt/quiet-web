import React, { useState } from 'react';
import { Grid } from '@arco-design/web-react';
import ProjectGroupManager from '@/pages/scrum/project-manager/project-group-manager';
import { getQueryParams } from '@/utils/getUrlParams';
import ProjectList from '@/pages/scrum/project-manager/project-list';
const { Row, Col } = Grid;

function ProjectManager() {
  const query: { projectGroupId?: string } = getQueryParams();

  const [projectGroupId, setProjectGroupId] = useState<string>(
    query.projectGroupId
  );

  return (
    <Row gutter={15}>
      <Col span={5}>
        <ProjectGroupManager
          defaultActiveId={projectGroupId}
          onGroupClick={(id) => setProjectGroupId(id)}
        />
      </Col>
      <Col span={19}>
        <ProjectList groupId={projectGroupId} />
      </Col>
    </Row>
  );
}

export default ProjectManager;
