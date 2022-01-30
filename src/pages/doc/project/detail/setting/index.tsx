import { Tabs } from 'antd';
import Environment from '@/pages/doc/project/detail/setting/components/environment';
import ProjectConfig from '@/pages/doc/project/detail/setting/components/projectConfig';
import type { DocProject } from '@/services/doc/EntityType';

interface ProjectSettingProp {
  projectInfo: DocProject;
}

export default function Config(props: ProjectSettingProp) {
  return (
    <div style={{ marginRight: 30 }}>
      <Tabs defaultActiveKey="config" size={'small'} type={'card'}>
        <Tabs.TabPane tab="项目设置" key="config">
          <ProjectConfig projectInfo={props.projectInfo} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="环境配置" key="environment">
          <Environment projectInfo={props.projectInfo} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
