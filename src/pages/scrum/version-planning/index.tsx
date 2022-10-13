import React, { useEffect, useState } from 'react';
import { getQueryParams } from '@/utils/getUrlParams';
import { Card, Divider, Empty, Form } from '@arco-design/web-react';
import ProjectGroupSelect, {
  PERSONAL_SPACE_VALUE,
} from '@/components/scrum/ProjectGroupSelect';
import ProjectSelect from '@/components/scrum/ProjectSelect';
import { listProject } from '@/service/scrum/project';
import VersionPlanningContent from '@/pages/scrum/version-planning/version-planning-content';

function VersionPlanning() {
  const query = getQueryParams();

  const [projectId, setProjectId] = useState(query.projectId);
  const [groupId, setGroupId] = useState(query.groupId);

  useEffect(() => {
    listProject(PERSONAL_SPACE_VALUE === groupId ? undefined : groupId).then(
      (resp) => {
        if (resp?.length > 0) {
          setProjectId(resp[0].id);
        } else {
          setProjectId(undefined);
        }
      }
    );
  }, [groupId]);

  return (
    <Card>
      <Form layout={'inline'}>
        <Form.Item label={'项目组'}>
          <ProjectGroupSelect
            style={{ width: 300 }}
            placeholder={'请输入项目组名称'}
            value={groupId ? groupId : PERSONAL_SPACE_VALUE}
            onChange={(val) => setGroupId(val)}
          />
        </Form.Item>
        <Form.Item label={'项目'}>
          <ProjectSelect
            allowClear
            value={projectId}
            style={{ width: 300 }}
            placeholder={'请输入项目名称'}
            groupId={PERSONAL_SPACE_VALUE === groupId ? undefined : groupId}
            onChange={(val) => setProjectId(val)}
          />
        </Form.Item>
      </Form>

      <div style={{ marginTop: 15, width: '100%' }}>
        {projectId ? (
          <>
            <Divider />
            <div style={{ marginTop: 10 }}>
              <VersionPlanningContent projectId={projectId} />
            </div>
          </>
        ) : (
          <Empty description={'请选择要规划的项目'} style={{ width: '100%' }} />
        )}
      </div>
    </Card>
  );
}

export default VersionPlanning;
