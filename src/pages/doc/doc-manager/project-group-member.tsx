import React, { useEffect, useState } from 'react';
import { DocProjectGroupMember, Permission } from '@/service/doc/type';
import {
  addProjectGroupMember,
  listAllProjectGroupMember,
  removeProjectGroupMember,
  updateProjectGroupMember,
} from '@/service/doc/project-group';
import {
  Avatar,
  Button,
  Grid,
  Popconfirm,
  Select,
  Space,
  Table,
  TableColumnProps,
} from '@arco-design/web-react';
import { IconDelete, IconPlus } from '@arco-design/web-react/icon';
import { enumToSelectOptions } from '@/utils/render';
import ProjectGroupMemberForm, {
  ProjectGroupMemberFormProps,
} from '@/components/doc/ProjectGroupMemberForm';

export type ProjectGroupMemberProps = {
  groupId: string;
};

function ProjectGroupMember(props: ProjectGroupMemberProps) {
  const [members, setMembers] = useState<DocProjectGroupMember[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [groupMemberFormProps, setGroupMemberFormProps] =
    useState<ProjectGroupMemberFormProps>({ groupId: props.groupId });

  useEffect(() => {
    listAllMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.groupId]);

  function listAllMembers() {
    setLoading(true);
    listAllProjectGroupMember(props.groupId)
      .then((resp) => {
        setMembers(resp);
      })
      .finally(() => setLoading(false));
  }

  const columns: TableColumnProps<DocProjectGroupMember>[] = [
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 64,
      fixed: 'left',
      render: (avatar, record) => {
        return (
          <Avatar
            shape={'square'}
            size={30}
            style={{
              backgroundColor: 'rgb(var(--blue-6))',
            }}
          >
            {avatar ? (
              <img alt={record.username} src={avatar} />
            ) : (
              record.username.substring(0, 1)
            )}
          </Avatar>
        );
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        return (
          <Space>
            <Select
              style={{ width: 100 }}
              value={record.permission}
              options={enumToSelectOptions(Permission)}
              onChange={(value) => {
                record.permission = value;
                updateProjectGroupMember(record).then(() => listAllMembers());
              }}
            />
            {
              <Popconfirm
                title="确认移除该成员吗？"
                onOk={() => {
                  removeProjectGroupMember(props.groupId, record.user_id).then(
                    () => listAllMembers()
                  );
                }}
              >
                <Button
                  icon={<IconDelete />}
                  type={'dashed'}
                  status={'danger'}
                />
              </Popconfirm>
            }
          </Space>
        );
      },
    },
  ];

  return (
    <Space direction={'vertical'} style={{ width: '100%' }}>
      <Button
        type={'primary'}
        icon={<IconPlus />}
        onClick={() => {
          setGroupMemberFormProps({
            visible: true,
            title: '添加成员',
            groupId: props.groupId,
            onOk: (values) =>
              addProjectGroupMember(values).then(() => {
                listAllMembers();
                setGroupMemberFormProps({
                  visible: false,
                  groupId: props.groupId,
                });
              }),
            onCancel: () =>
              setGroupMemberFormProps({
                visible: false,
                groupId: props.groupId,
              }),
          });
        }}
      >
        添加成员
      </Button>
      <Grid.Row style={{ width: '100%', paddingTop: 10 }}>
        <Table
          rowKey={'username'}
          border={false}
          showHeader={false}
          pagination={false}
          loading={loading}
          style={{ width: '100%' }}
          columns={columns}
          data={members}
        />
      </Grid.Row>
      <ProjectGroupMemberForm {...groupMemberFormProps} />
    </Space>
  );
}

export default ProjectGroupMember;
