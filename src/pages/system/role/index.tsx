import React, { useRef, useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { pageRole, deleteRole } from '@/services/system/QuietRole';
import { PageContainer } from '@ant-design/pro-layout';
import RoleTree from '@/pages/system/role/components/RoleTree';
import RoleForm from '@/pages/system/role/components/RoleForm';
import type { QuietRole } from '@/services/system/EntityType';

const RoleManagement: React.FC<any> = () => {
  const [updateRoleInfo, setUpdateRoleInfo] = useState<QuietRole>();
  const [roleFormVisible, setRoleModalVisible] = useState<boolean>(false);
  const [roleTreeVisible, setRoleTreeVisible] = useState<boolean>(false);

  const roleModalActionRef = useRef<ActionType>();
  const columns: ProColumns<QuietRole>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      copyable: true,
    },
    {
      title: '角色名',
      dataIndex: 'role_name',
      valueType: 'text',
    },
    {
      title: '角色中文名',
      dataIndex: 'role_cn_name',
      valueType: 'text',
    },
    {
      title: '父角色 ID',
      dataIndex: 'parent_id',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '父角色名',
      dataIndex: 'parent_role_name',
      valueType: 'text',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
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
      width: 120,
      valueType: 'option',
      render: (_, record) => {
        return [
          <a
            key="update"
            onClick={() => {
              const role = { ...record };
              setUpdateRoleInfo(role);
              setRoleModalVisible(true);
            }}
          >
            修改
          </a>,
          <Popconfirm
            key="delete"
            placement="topLeft"
            title="确认删除该角色吗？"
            onConfirm={() => {
              deleteRole(record.id).then(() => roleModalActionRef?.current?.reload());
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

  function createRole() {
    setUpdateRoleInfo(undefined);
    setRoleModalVisible(true);
  }

  return (
    <PageContainer>
      <ProTable<QuietRole>
        actionRef={roleModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => pageRole({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="tree" onClick={() => setRoleTreeVisible(true)}>
            所有角色
          </Button>,
          <Button type="primary" key="create" onClick={createRole}>
            <PlusOutlined /> 新建角色
          </Button>,
        ]}
        columns={columns}
        columnsState={{ value: columnsStateMap }}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {roleFormVisible && (
        <RoleForm
          visible={roleFormVisible}
          onCancel={() => setRoleModalVisible(false)}
          updateInfo={updateRoleInfo}
          afterAction={() => roleModalActionRef?.current?.reload()}
        />
      )}
      {roleTreeVisible && (
        <RoleTree
          multiple
          visible={roleTreeVisible}
          onCancel={() => setRoleTreeVisible(false)}
          onOk={() => setRoleTreeVisible(false)}
        />
      )}
    </PageContainer>
  );
};

export default RoleManagement;
