import React, { useEffect, useState } from 'react';
import { getQueryParams } from '@/utils/getUrlParams';
import { Card, Empty, Form, Grid } from '@arco-design/web-react';
import ProjectGroupSelect, {
  PERSONAL_SPACE_VALUE,
} from '@/components/scrum/ProjectGroupSelect';
import ProjectSelect from '@/components/scrum/ProjectSelect';
import { listProject } from '@/service/scrum/project';
import VersionPlanningContent from '@/pages/scrum/version-planning/version-planning-content';
import styles from './style/index.module.less';

const { Row, Col } = Grid;

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
      <div className={styles['search-form-wrapper']}>
        <Form
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          className={styles['search-form']}
        >
          <Row gutter={24} style={{ width: '100%' }}>
            <Col span={6}>
              <Form.Item label={'项目组'}>
                <ProjectGroupSelect
                  placeholder={'请输入项目组名称'}
                  value={groupId ? groupId : PERSONAL_SPACE_VALUE}
                  onChange={(val) => setGroupId(val)}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={'项目'}>
                <ProjectSelect
                  allowClear
                  value={projectId}
                  placeholder={'请输入项目名称'}
                  groupId={
                    PERSONAL_SPACE_VALUE === groupId ? undefined : groupId
                  }
                  onChange={(val) => setProjectId(val)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      {projectId ? (
        <VersionPlanningContent projectId={projectId} />
      ) : (
        <Empty description={'请选择要规划的项目'} style={{ width: '100%' }} />
      )}
    </Card>
  );
}

export default VersionPlanning;
