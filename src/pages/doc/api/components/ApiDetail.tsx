import { Tabs } from 'antd';
import ApiPreview from '@/pages/doc/project/detail/components/ApiPreview';
import ApiEdit from '@/pages/doc/project/detail/components/ApiEdit';
import { useEffect, useState } from 'react';
import type { ApiDetail } from '@/services/doc/EntityType';
import { getAiDetail } from '@/services/doc/DocApi';
import ApiRun from '@/pages/doc/project/detail/components/ApiRun';
import { EditOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';

interface ApiDetailProps {
  apiId: string;
  projectId: string;
  afterUpdate?: () => void;
}

export default (props: ApiDetailProps) => {
  const { apiId, projectId, afterUpdate } = props;

  const [apiDetail, setApiDetail] = useState<ApiDetail>();

  useEffect(() => {
    getAiDetail(apiId).then((detail) => setApiDetail(detail));
  }, [apiId]);

  return (
    <Tabs defaultActiveKey={'preview'} tabBarStyle={{ marginTop: -12 }}>
      <Tabs.TabPane
        key={'preview'}
        tab={
          <span>
            &nbsp;
            <EyeOutlined />
            预览&nbsp;
          </span>
        }
      >
        {apiDetail && <ApiPreview apiDetail={apiDetail} />}
      </Tabs.TabPane>
      <Tabs.TabPane
        key={'edit'}
        tab={
          <span>
            &nbsp;
            <EditOutlined />
            编辑&nbsp;
          </span>
        }
      >
        {apiDetail && (
          <ApiEdit
            projectId={projectId}
            apiDetail={apiDetail}
            afterUpdate={() => {
              getAiDetail(apiId).then((detail) => setApiDetail(detail));
              if (afterUpdate) {
                afterUpdate();
              }
            }}
          />
        )}
      </Tabs.TabPane>
      <Tabs.TabPane
        key={'run'}
        tab={
          <span>
            &nbsp;
            <SendOutlined />
            运行&nbsp;
          </span>
        }
      >
        {apiDetail && <ApiRun />}
      </Tabs.TabPane>
    </Tabs>
  );
};
