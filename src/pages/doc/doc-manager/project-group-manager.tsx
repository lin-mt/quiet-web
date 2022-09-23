import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Menu, Tooltip } from '@arco-design/web-react';
import { IconBook, IconPlus, IconUser } from '@arco-design/web-react/icon';
import ProjectGroupForm, {
  ProjectGroupFormProps,
} from '@/components/doc/ProjectGroupForm';
import {
  listAllProjectGroup,
  saveProjectGroup,
} from '@/service/doc/project-group';
import { DocProjectGroup } from '@/service/doc/type';

export type ProjectGroupManagerProps = {
  defaultActiveId?: string;
  onGroupClick?: (projectGroupId?: string) => void;
};

export function ProjectGroupManager(props: ProjectGroupManagerProps) {
  const defaultId = 'default';
  const [projectGroupFormProps, setProjectGroupFormProps] =
    useState<ProjectGroupFormProps>({});
  const [projectGroups, setProjectGroups] = useState<DocProjectGroup[]>([]);
  const [selectKeys, setSelectKeys] = useState<string[]>([
    props.defaultActiveId ? props.defaultActiveId : defaultId,
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listAll();
  }, []);

  function listAll(name?: string) {
    setLoading(true);
    listAllProjectGroup(name)
      .then((groups) => {
        if (groups && groups.length > 0) {
          setProjectGroups(groups);
        }
      })
      .finally(() => setLoading(false));
  }

  function handleProjectGroupSelect(id: string) {
    setSelectKeys([id]);
    let replaceUrl = '/doc/doc-manager';
    if (defaultId === id) {
      props.onGroupClick();
    } else {
      props.onGroupClick(id);
      replaceUrl = `${replaceUrl}?projectGroupId=${id}`;
    }
    window.history.replaceState(null, null, replaceUrl);
  }

  return (
    <Card
      title={'项目分组'}
      bodyStyle={{ padding: 0 }}
      extra={
        <Tooltip content={'新建分组'}>
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
          />
        </Tooltip>
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
            <IconBook />
            {projectGroup.name}
          </Menu.Item>
        ))}
      </Menu>

      <ProjectGroupForm {...projectGroupFormProps} />
    </Card>
  );
}

export default ProjectGroupManager;
