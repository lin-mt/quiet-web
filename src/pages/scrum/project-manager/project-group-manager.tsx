import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Menu } from '@arco-design/web-react';
import { IconApps, IconPlus, IconUser } from '@arco-design/web-react/icon';
import ProjectGroupForm, {
  ProjectGroupFormProps,
} from '@/components/scrum/ProjectGroupForm';
import {
  listProjectGroup,
  saveProjectGroup,
} from '@/service/scrum/project-group';
import { ScrumProjectGroup } from '@/service/scrum/type';

export type ProjectGroupManagerProps = {
  defaultActiveId?: string;
  onGroupClick?: (projectGroupId?: string) => void;
};

export function ProjectGroupManager(props: ProjectGroupManagerProps) {
  const defaultId = 'default';
  const [projectGroupFormProps, setProjectGroupFormProps] =
    useState<ProjectGroupFormProps>({});
  const [projectGroups, setProjectGroups] = useState<ScrumProjectGroup[]>([]);
  const [selectKeys, setSelectKeys] = useState<string[]>([
    props.defaultActiveId ? props.defaultActiveId : defaultId,
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listAll();
  }, []);

  function listAll(name?: string) {
    setLoading(true);
    listProjectGroup(name)
      .then((groups) => {
        setProjectGroups(groups);
      })
      .finally(() => setLoading(false));
  }

  function handleProjectGroupSelect(id: string) {
    setSelectKeys([id]);
    let replaceUrl = '/scrum/project-manager';
    if (defaultId === id) {
      props.onGroupClick();
    } else {
      props.onGroupClick(id);
      replaceUrl = `${replaceUrl}?projectGroupId=${id}`;
    }
    window.history.pushState(null, null, replaceUrl);
  }

  return (
    <Card
      title={'项目分组'}
      bodyStyle={{ padding: 0 }}
      extra={
        <Button
          onClick={() =>
            setProjectGroupFormProps({
              title: '新建分组',
              visible: true,
              onCancel: () => setProjectGroupFormProps({ visible: false }),
              onOk: (values) =>
                saveProjectGroup(values).then(() => {
                  setProjectGroupFormProps({ visible: false });
                  listAll();
                }),
            })
          }
          type={'text'}
          icon={<IconPlus />}
        >
          新建分组
        </Button>
      }
    >
      <div style={{ padding: '0 8px 4px 8px' }}>
        <Input.Search
          allowClear
          loading={loading}
          placeholder="请输入分组名称"
          searchButton
          onSearch={(value) => listAll(value)}
        />
      </div>
      <Menu selectedKeys={selectKeys}>
        <Menu.Item
          key={defaultId}
          onClick={() => handleProjectGroupSelect(defaultId)}
        >
          <IconUser />
          个人空间
        </Menu.Item>
        {projectGroups.map((projectGroup) => (
          <Menu.Item
            key={projectGroup.id}
            onClick={() => handleProjectGroupSelect(projectGroup.id)}
          >
            <IconApps />
            {projectGroup.name}
          </Menu.Item>
        ))}
      </Menu>

      <ProjectGroupForm {...projectGroupFormProps} />
    </Card>
  );
}

export default ProjectGroupManager;
