import { Tabs } from 'antd';
import Environment from '@/pages/doc/project/detail/setting/components/environment';
import ProjectConfig from '@/pages/doc/project/detail/setting/components/projectConfig';

interface ProjectSettingProp {
  projectId: string;
}

export default function Config(props: ProjectSettingProp) {
  return (
    <div style={{ marginRight: 30 }}>
      <Tabs defaultActiveKey="config" size={'small'} type={'card'}>
        <Tabs.TabPane tab="项目配置" key="config">
          <ProjectConfig projectId={props.projectId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="环境配置" key="environment">
          <Environment projectId={props.projectId} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
