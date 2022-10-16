import React, { useState } from 'react';
import styles from './style/index.module.less';
import { Form, Grid } from '@arco-design/web-react';
import ProjectGroupSelect, {
  PERSONAL_SPACE_VALUE,
} from '@/components/scrum/ProjectGroupSelect';
import ProjectSelect from '@/components/scrum/ProjectSelect';
import { getQueryParams } from '@/utils/getUrlParams';
import VersionSelect from '@/components/scrum/VersionSelect';
import { ScrumIteration } from '@/service/scrum/type';

const { Row, Col } = Grid;

export type ScrumPlanningSelectProps = {
  hideVersionSelect?: boolean;
  onGroupChange?: (groupId?: string) => void;
  onProjectChange?: (projectId?: string) => void;
  onVersionIdChange?: (versionId?: string, iterations?: []) => void;
  handleIterationsChange?: (iterations: ScrumIteration[]) => void;
};

function ScrumPlanningSelect(props: ScrumPlanningSelectProps) {
  const query = getQueryParams();

  const [groupId, setGroupId] = useState(query.groupId);
  const [projectId, setProjectId] = useState(query.projectId);
  const [versionId, setVersionId] = useState(query.versionId);

  function handleProjectIdChange(val) {
    setProjectId(val);
    handleVersionIdChange(undefined);
    if (props.onProjectChange) {
      props.onProjectChange(val);
    }
  }

  function handleVersionIdChange(val, node?: { trigger }) {
    setVersionId(val);
    if (props.onVersionIdChange) {
      props.onVersionIdChange(val, node?.trigger?.dataRef.iterations);
    }
  }

  return (
    <div className={styles['select-form-wrapper']}>
      <Form
        colon
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        className={styles['select-form']}
      >
        <Row gutter={24} style={{ width: '100%' }}>
          <Col span={6}>
            <Form.Item label={'项目组'}>
              <ProjectGroupSelect
                placeholder={'请输入项目组名称'}
                value={groupId ? groupId : PERSONAL_SPACE_VALUE}
                onChange={(val) => {
                  const newVal = PERSONAL_SPACE_VALUE === val ? undefined : val;
                  setGroupId(newVal);
                  handleProjectIdChange(undefined);
                  if (props.onGroupChange) {
                    props.onGroupChange(newVal);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={'规划项目'}>
              <ProjectSelect
                allowClear
                value={projectId}
                placeholder={'请输入项目名称'}
                groupId={groupId}
                onChange={handleProjectIdChange}
              />
            </Form.Item>
          </Col>
          {!props.hideVersionSelect && (
            <Col span={6}>
              <Form.Item label={'规划版本'}>
                <VersionSelect
                  allowClear
                  value={versionId}
                  projectId={projectId}
                  handleIterationsChange={props.handleIterationsChange}
                  placeholder={'请输入版本名称'}
                  onChange={handleVersionIdChange}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
}

export default ScrumPlanningSelect;
