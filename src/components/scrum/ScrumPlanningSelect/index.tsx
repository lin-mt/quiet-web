import React, { useEffect, useState } from 'react';
import styles from './style/index.module.less';
import { Form, Grid } from '@arco-design/web-react';
import ProjectGroupSelect, {
  PERSONAL_SPACE_VALUE,
} from '@/components/scrum/ProjectGroupSelect';
import ProjectSelect from '@/components/scrum/ProjectSelect';
import { getQueryParams } from '@/utils/getUrlParams';
import VersionSelect from '@/components/scrum/VersionSelect';
import { ScrumIteration } from '@/service/scrum/type';
import { LocalStorage } from '@/constant/scrum';
import _ from 'lodash';

const { Row, Col } = Grid;

export type Params = {
  groupId?: string;
  projectId?: string;
  versionId?: string;
};

export enum LocalParamKeys {
  DEMAND_PLANNING = 'demand_planning',
  VERSION_PLANNING = 'version_planning',
}

function updateUrlParam(params: Params) {
  const searchParams = new URLSearchParams(window.location.search);
  function updateSearchParams(name: string, value) {
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
  }
  updateSearchParams('groupId', params.groupId);
  updateSearchParams('projectId', params.projectId);
  updateSearchParams('versionId', params.versionId);
  let url = window.location.pathname;
  if (searchParams.toString().length > 0) {
    url = url + '?' + searchParams.toString();
  }
  window.history.pushState(null, null, url);
}

function getParams(key?: LocalParamKeys): Params {
  const query = getQueryParams();
  if (query.groupId || query.projectId) {
    if (key) {
      updateParams(key, query);
    }
    return query;
  }
  if (!key) {
    return {};
  }
  const localParams = localStorage.getItem(
    LocalStorage.ScrumPlanningSelectParams
  );
  if (localParams) {
    const params = JSON.parse(localParams)[key];
    if (params) {
      updateUrlParam(params);
      return params;
    }
  }
  return {};
}

function updateParams(key: LocalParamKeys, params?: Params) {
  const localParams = localStorage.getItem(
    LocalStorage.ScrumPlanningSelectParams
  );
  let newParams = {};
  if (localParams && params) {
    newParams = _.clone(JSON.parse(localParams));
    newParams[key] = { ...newParams[key], ...params };
  } else {
    newParams[key] = params;
  }
  updateUrlParam(newParams[key]);
  localStorage.setItem(
    LocalStorage.ScrumPlanningSelectParams,
    JSON.stringify(newParams)
  );
}

export type ScrumPlanningSelectProps = {
  localParamKey?: LocalParamKeys;
  localParams?: (params: Params) => void;
  hideVersionSelect?: boolean;
  onGroupChange?: (groupId?: string) => void;
  onProjectChange?: (projectId?: string) => void;
  onVersionIdChange?: (versionId?: string, iterations?: []) => void;
  handleIterationsChange?: (iterations: ScrumIteration[]) => void;
};

function ScrumPlanningSelect(props: ScrumPlanningSelectProps) {
  const [groupId, setGroupId] = useState<string>();
  const [projectId, setProjectId] = useState<string>();
  const [versionId, setVersionId] = useState<string>();

  useEffect(() => {
    const params = getParams(props.localParamKey);
    setGroupId(params.groupId);
    setProjectId(params.projectId);
    setVersionId(params.versionId);
    if (props.localParams) {
      props.localParams(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleProjectIdChange(val) {
    setProjectId(val);
    handleVersionIdChange(undefined);
    if (props.onProjectChange) {
      props.onProjectChange(val);
    }
    if (props.localParamKey) {
      updateParams(props.localParamKey, { projectId: val });
    }
  }

  function handleGroupIdChange(val) {
    const newVal = PERSONAL_SPACE_VALUE === val ? undefined : val;
    setGroupId(newVal);
    handleProjectIdChange(undefined);
    if (props.onGroupChange) {
      props.onGroupChange(newVal);
    }
    if (props.localParamKey) {
      updateParams(props.localParamKey, { groupId: newVal });
    }
  }

  function handleVersionIdChange(val, node?: { trigger }) {
    setVersionId(val);
    if (props.onVersionIdChange) {
      props.onVersionIdChange(val, node?.trigger?.dataRef.iterations);
    }
    if (props.localParamKey) {
      updateParams(props.localParamKey, { versionId: val });
    }
  }

  function handleIterationsChange(id) {
    if (props.handleIterationsChange) {
      props.handleIterationsChange(id);
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
                onChange={handleGroupIdChange}
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
                  handleIterationsChange={handleIterationsChange}
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
