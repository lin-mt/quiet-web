import React, { useState } from 'react';
import { Card, Empty, Grid, Select } from '@arco-design/web-react';
import { getQueryParams } from '@/utils/getUrlParams';
import ScrumPlanningSelect from '@/components/scrum/ScrumPlanningSelect';
import DemandPool from '@/pages/scrum/demand-planning/demand-pool';

const { Row, Col } = Grid;

function DemandPlanning() {
  const query = getQueryParams();
  const [projectId, setProjectId] = useState(query.projectId);
  const [versionId, setVersionId] = useState(query.versionId);
  const [iterationId, setIterationId] = useState(query.iterationId);
  const [iterations, setIterations] = useState([]);

  function handleVersionChange(vId, is) {
    setVersionId(vId);
    setIterationId(undefined);
    setIterations(is?.map((i) => ({ value: i.id, label: i.name })));
  }

  return (
    <Card>
      <ScrumPlanningSelect
        onProjectChange={(id) => setProjectId(id)}
        onVersionIdChange={handleVersionChange}
        handleIterationsChange={(is) => {
          setIterations(is?.map((i) => ({ value: i.id, label: i.name })));
        }}
      />
      {!projectId ? (
        <Empty description={'请选择规划项目'} />
      ) : (
        <Row gutter={15}>
          <Col span={12}>
            <DemandPool projectId={projectId} />
          </Col>
          <Col span={12}>
            {!versionId ? (
              <Card>
                <Empty
                  style={{ paddingTop: 60 }}
                  description={'请选择规划版本'}
                />
              </Card>
            ) : (
              <Card
                bordered
                hoverable
                title={'规划迭代'}
                extra={
                  <Select
                    value={iterationId}
                    options={iterations}
                    placeholder={'请选择迭代'}
                    style={{ width: 300 }}
                    onChange={(value) => setIterationId(value)}
                  />
                }
              >
                {!iterationId ? (
                  <Empty description={'请选择规划迭代'} />
                ) : (
                  <>加载迭代+需求信息</>
                )}
              </Card>
            )}
          </Col>
        </Row>
      )}
    </Card>
  );
}

export default DemandPlanning;
