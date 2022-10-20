import React, { useState } from 'react';
import { Grid } from '@arco-design/web-react';
import ProjectGroupManager from '@/pages/scrum/project-manager/project-group-manager';
import { getQueryParams } from '@/utils/urlParams';
import ProjectList from '@/pages/scrum/project-manager/project-list';
const { Row, Col } = Grid;

function ProjectManager() {
  const query: { group_id?: string } = getQueryParams();

  const [groupId, setGroupId] = useState<string>(query.group_id);

  return (
    <Row gutter={15}>
      <Col span={5}>
        <ProjectGroupManager
          defaultActiveId={groupId}
          onGroupClick={(id) => setGroupId(id)}
        />
      </Col>
      <Col span={19}>
        <ProjectList groupId={groupId} />
      </Col>
    </Row>
  );
}

export default ProjectManager;
