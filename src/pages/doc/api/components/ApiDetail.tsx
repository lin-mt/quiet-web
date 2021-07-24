import { Tabs } from 'antd';
import ApiPreview from '@/pages/doc/project/detail/components/ApiPreview';

interface ApiDetailProps {
  apiId: string;
}

export default (props: ApiDetailProps) => {
  return (
    <Tabs defaultActiveKey={'preview'}>
      <Tabs.TabPane key={'preview'} tab={'预览'}>
        <ApiPreview />
      </Tabs.TabPane>
      <Tabs.TabPane key={'edit'} tab={'编辑'}>
        编辑{props.apiId}
      </Tabs.TabPane>
      <Tabs.TabPane key={'run'} tab={'运行'}>
        运行
      </Tabs.TabPane>
    </Tabs>
  );
};
