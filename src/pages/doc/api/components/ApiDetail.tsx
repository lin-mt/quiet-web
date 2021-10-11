import { Tabs } from 'antd';
import ApiPreview from '@/pages/doc/project/detail/components/ApiPreview';
import ApiEdit from '@/pages/doc/project/detail/components/ApiEdit';
import { useEffect, useState } from 'react';
import type { ApiDetail } from '@/services/doc/EntityType';
import { getAiDetail } from '@/services/doc/DocApi';

interface ApiDetailProps {
  apiId: string;
  projectId: string;
}

export default (props: ApiDetailProps) => {
  const { apiId, projectId } = props;

  const [apiDetail, setApiDetail] = useState<ApiDetail>();

  useEffect(() => {
    getAiDetail(apiId).then((detail) => setApiDetail(detail));
  }, [apiId]);

  return (
    <Tabs defaultActiveKey={'preview'} tabBarStyle={{ marginTop: -12 }}>
      <Tabs.TabPane key={'preview'} tab={'预 览'}>
        {apiDetail && <ApiPreview apiDetail={apiDetail} />}
      </Tabs.TabPane>
      <Tabs.TabPane key={'edit'} tab={'编 辑'}>
        {apiDetail && <ApiEdit projectId={projectId} apiDetail={apiDetail} />}
      </Tabs.TabPane>
      <Tabs.TabPane key={'run'} tab={'运 行'}>
        运行
      </Tabs.TabPane>
    </Tabs>
  );
};
