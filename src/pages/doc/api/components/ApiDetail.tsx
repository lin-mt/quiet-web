import { Tabs } from 'antd';
import ApiPreview from '@/pages/doc/project/detail/components/ApiPreview';
import ApiEdit from '@/pages/doc/project/detail/components/ApiEdit';
import { useCallback, useEffect, useState } from 'react';
import type { ApiDetail } from '@/services/doc/EntityType';
import { getAiDetail } from '@/services/doc/DocApi';

interface ApiDetailProps {
  apiId: string;
  projectId: string;
}

export default (props: ApiDetailProps) => {
  const { apiId, projectId } = props;

  const [apiDetail, setApiDetail] = useState<ApiDetail>();

  const initApiDetail = useCallback(() => {
    getAiDetail(apiId).then((detail) => setApiDetail(detail));
  }, [apiId]);

  useEffect(() => {
    initApiDetail();
  }, [initApiDetail]);

  return (
    <Tabs defaultActiveKey={'preview'} tabBarStyle={{ marginTop: -12 }}>
      <Tabs.TabPane key={'preview'} tab={'预览'}>
        <ApiPreview />
      </Tabs.TabPane>
      <Tabs.TabPane key={'edit'} tab={'编辑'}>
        <ApiEdit projectId={projectId} apiId={apiId} apiDetail={apiDetail} />
      </Tabs.TabPane>
      <Tabs.TabPane key={'run'} tab={'运行'}>
        运行
      </Tabs.TabPane>
    </Tabs>
  );
};
