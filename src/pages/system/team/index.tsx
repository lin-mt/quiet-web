import React, { useRef, useState } from 'react';
import { Button, Popconfirm, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { pageTeam, deleteTeam } from '@/services/system/QuietTeam';
import { PageContainer } from '@ant-design/pro-layout';
import TeamForm from './components/TeamForm';
import type { QuietTeam } from '@/services/system/EntityType';

const TeamManagement: React.FC<any> = () => {
  const [updateTeamInfo, setUpdateTeamInfo] = useState<QuietTeam>();
  const [roleFormVisible, setTeamModalVisible] = useState<boolean>(false);
  const teamModalActionRef = useRef<ActionType>();
  const columns: ProColumns<QuietTeam>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      copyable: true,
    },
    {
      title: '团队名',
      dataIndex: 'team_name',
      valueType: 'text',
    },
    {
      title: 'ProductOwner',
      dataIndex: 'product_owners',
      search: false,
      render: (_, record) => (
        <Space>
          {record.product_owners
            ? record.product_owners.map(({ id, full_name }) => (
                <Tag color={'#108EE9'} key={id}>
                  {full_name}
                </Tag>
              ))
            : '-'}
        </Space>
      ),
    },
    {
      title: 'ScrumMaster',
      dataIndex: 'scrum_masters',
      search: false,
      render: (_, record) => (
        <Space>
          {record.scrum_masters
            ? record.scrum_masters.map(({ id, full_name }) => (
                <Tag color={'#108EE9'} key={id}>
                  {full_name}
                </Tag>
              ))
            : '-'}
        </Space>
      ),
    },
    {
      title: '团队成员',
      dataIndex: 'members',
      search: false,
      render: (_, record) => (
        <Space>
          {record.members
            ? record.members.map(({ id, full_name }) => (
                <Tag color={'#108EE9'} key={id}>
                  {full_name}
                </Tag>
              ))
            : '-'}
        </Space>
      ),
    },
    {
      title: '标语',
      dataIndex: 'slogan',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'gmt_create',
      key: 'gmt_create',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'gmt_update',
      key: 'gmt_update',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      render: (_, record) => {
        return [
          <a
            key="update"
            onClick={() => {
              setUpdateTeamInfo({ ...record });
              setTeamModalVisible(true);
            }}
          >
            编辑
          </a>,
          <Popconfirm
            key="delete"
            placement="topLeft"
            title="确认删除该团队以及队员信息吗？"
            onConfirm={() => {
              deleteTeam(record.id).then(() => teamModalActionRef?.current?.reload());
            }}
          >
            <a key="delete">删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];

  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    gmt_create: { show: false },
    gmt_update: { show: false },
  });

  function createTeam() {
    setUpdateTeamInfo(undefined);
    setTeamModalVisible(true);
  }

  function handleTeamFormCancel() {
    setTeamModalVisible(false);
  }

  return (
    <PageContainer>
      <ProTable<QuietTeam>
        actionRef={teamModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => pageTeam({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={createTeam}>
            <PlusOutlined /> 新建团队
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {roleFormVisible && (
        <TeamForm
          visible={roleFormVisible}
          onCancel={handleTeamFormCancel}
          updateInfo={updateTeamInfo}
          afterAction={() => teamModalActionRef?.current?.reload()}
        />
      )}
    </PageContainer>
  );
};

export default TeamManagement;
