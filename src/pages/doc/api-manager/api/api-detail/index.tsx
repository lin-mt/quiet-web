import React, { useEffect, useState } from 'react';
import { Card, Tabs } from '@arco-design/web-react';
import styles from './style/index.module.less';
import { IconEdit, IconEye, IconPlayArrow } from '@arco-design/web-react/icon';
import styled from 'styled-components';
import { DocApi, DocProject } from '@/service/doc/type';
import { getApiDetail } from '@/service/doc/api';
import Preview from '@/pages/doc/api-manager/api/api-detail/api-preview';
import ApiEditor from '@/pages/doc/api-manager/api/api-detail/api-editor';
import ApiRun from '@/pages/doc/api-manager/api/api-detail/api-run';

const { TabPane } = Tabs;

export type ApiDetailProps = {
  apiId: string;
  projectInfo: DocProject;
};

const ApiDetailTabPane = styled(TabPane)`
  padding: 5px 21px 21px 21px;
`;

function ApiDetail(props: ApiDetailProps) {
  const [apiDetail, setApiDetail] = useState<DocApi>();
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    loadApiDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.apiId]);

  function loadApiDetail() {
    getApiDetail(props.apiId).then((api) => {
      setApiDetail(api);
    });
  }

  return (
    <Card
      bodyStyle={{ padding: 0 }}
      className={styles['api-detail']}
      loading={!apiDetail}
    >
      <Tabs
        destroyOnHide
        activeTab={activeTab}
        onChange={(key) => setActiveTab(key)}
      >
        <ApiDetailTabPane
          key={'preview'}
          title={
            <span>
              <IconEye /> 预览
            </span>
          }
        >
          <Preview api={apiDetail} projectInfo={props.projectInfo} />
        </ApiDetailTabPane>
        <ApiDetailTabPane
          key={'edit'}
          title={
            <span>
              <IconEdit /> 编辑
            </span>
          }
        >
          <ApiEditor
            api={apiDetail}
            projectInfo={props.projectInfo}
            handleUpdate={() => loadApiDetail()}
          />
        </ApiDetailTabPane>
        <ApiDetailTabPane
          key={'run'}
          title={
            <span>
              <IconPlayArrow /> 运行
            </span>
          }
        >
          <ApiRun apiDetail={apiDetail} projectInfo={props.projectInfo} />
        </ApiDetailTabPane>
      </Tabs>
    </Card>
  );
}

export default ApiDetail;
