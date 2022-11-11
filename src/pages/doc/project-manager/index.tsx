import React, { useState } from 'react';
import { Grid } from '@arco-design/web-react';
import ProjectGroupManager from '@/pages/doc/project-manager/project-group-manager';
import ProjectGroupContent from '@/pages/doc/project-manager/project-group-content';
import { getQueryParams } from '@/utils/urlParams';

const { Row, Col } = Grid;

export default function DocManager() {
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
        <ProjectGroupContent projectGroupId={projectGroupId} />
      </Col>
    </Row>
  );
}
