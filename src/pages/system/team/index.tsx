import React, { useRef, useState } from 'react';
import { Button, Form, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryTeam, deleteTeam } from '@/services/system/QuiteTeam';
import { PageContainer } from '@ant-design/pro-layout';
import { OperationType } from '@/types/Type';
import TeamForm from './components/TeamForm';

const TeamManagement: React.FC<any> = () => {
  const [updateTeamInfo, setUpdateTeamInfo] = useState<SystemEntities.QuiteTeam>();
  const [roleFormVisible, setTeamModalVisible] = useState<boolean>(false);
  const [roleFormType, setTeamOperationType] = useState<OperationType>();
  const teamModalActionRef = useRef<ActionType>();
  const [teamForm] = Form.useForm();
  const columns: ProColumns<SystemEntities.QuiteTeam>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      copyable: true,
    },
    {
      title: '团队名',
      dataIndex: 'teamName',
      valueType: 'text',
    },
    {
      title: '标语',
      dataIndex: 'slogan',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtUpdate',
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
              const team = { ...record };
              teamForm.setFieldsValue(team);
              setUpdateTeamInfo(team);
              setTeamOperationType(OperationType.UPDATE);
              setTeamModalVisible(true);
            }}
          >
            修改
          </a>,
          <Popconfirm
            key="delete"
            placement="topLeft"
            title="确认删除该团队以及队员信息吗？"
            onConfirm={() => {
              deleteTeam(record.id).then(() => refreshPageInfo());
            }}
          >
            <a key="delete">删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];

  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    gmtCreate: { show: false },
    gmtUpdate: { show: false },
  });

  function createTeam() {
    setTeamOperationType(OperationType.CREATE);
    setTeamModalVisible(true);
  }

  function handleTeamFormCancel() {
    setTeamModalVisible(false);
  }

  function refreshPageInfo() {
    teamModalActionRef?.current?.reload();
  }

  return (
    <PageContainer>
      <ProTable<SystemEntities.QuiteTeam>
        actionRef={teamModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => queryTeam({ params, sorter, filter })}
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
          operationType={roleFormType}
          form={teamForm}
          updateInfo={updateTeamInfo}
          afterAction={refreshPageInfo}
        />
      )}
    </PageContainer>
  );
};

export default TeamManagement;
