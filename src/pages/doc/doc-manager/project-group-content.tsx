import React from 'react';
import { Card, Tabs } from '@arco-design/web-react';
import { IconApps, IconUser } from '@arco-design/web-react/icon';
import ProjectList from '@/pages/doc/doc-manager/project-list';

const TabPane = Tabs.TabPane;

export type ProjectGroupContentProps = {
  projectGroupId?: string;
};

function ProjectGroupContent(props: ProjectGroupContentProps) {
  return (
    <Card bodyStyle={{ padding: '8px 16px 16px 16px' }}>
      <Tabs defaultActiveTab="pl">
        <TabPane
          key="pl"
          title={
            <span>
              <IconApps style={{ marginRight: 6 }} />
              项目列表
            </span>
          }
        >
          <ProjectList groupId={props.projectGroupId} />
        </TabPane>
        {props.projectGroupId && (
          <TabPane
            key="pm"
            title={
              <span>
                <IconUser style={{ marginRight: 6 }} />
                成员列表
              </span>
            }
          >
            成员列表
          </TabPane>
        )}
        {
          // TODO 分组动态、分组设置
        }
      </Tabs>
    </Card>
  );
}

export default ProjectGroupContent;
