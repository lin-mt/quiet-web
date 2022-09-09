import React, { useEffect, useState } from 'react';
import { Card, Tabs } from '@arco-design/web-react';
import { IconApps, IconUser } from '@arco-design/web-react/icon';
import ProjectGroupProject from '@/pages/doc/doc-manager/project-group-project';
import ProjectGroupMember from '@/pages/doc/doc-manager/project-group-member';

const TabPane = Tabs.TabPane;

export type ProjectGroupContentProps = {
  projectGroupId?: string;
};

function ProjectGroupContent(props: ProjectGroupContentProps) {
  const [activeTab, setActiveTab] = useState<string>('pgp');

  useEffect(() => {
    if (!props.projectGroupId) {
      setActiveTab('pgp');
    }
  }, [props.projectGroupId]);

  return (
    <Card bodyStyle={{ padding: '8px 16px 16px 16px' }}>
      <Tabs activeTab={activeTab} onClickTab={(key) => setActiveTab(key)}>
        <TabPane
          key="pgp"
          title={
            <span>
              <IconApps style={{ marginRight: 6 }} />
              项目列表
            </span>
          }
        >
          <ProjectGroupProject groupId={props.projectGroupId} />
        </TabPane>
        {props.projectGroupId && (
          <TabPane
            key="pgm"
            title={
              <span>
                <IconUser style={{ marginRight: 6 }} />
                成员列表
              </span>
            }
          >
            <ProjectGroupMember groupId={props.projectGroupId} />
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
