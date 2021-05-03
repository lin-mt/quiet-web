import React, { useRef, useState } from 'react';
import { Button, Form, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryRole, deleteRole } from '@/services/system/QuietRole';
import { PageContainer } from '@ant-design/pro-layout';
import { OperationType } from '@/types/Type';
import RoleTree from '@/pages/system/role/components/RoleTree';
import RoleForm from '@/pages/system/role/components/RoleForm';
import type { QuietRole } from '@/services/system/EntityType';

const RoleManagement: React.FC<any> = () => {
  const [updateRoleInfo, setUpdateRoleInfo] = useState<QuietRole>();
  const [roleFormVisible, setRoleModalVisible] = useState<boolean>(false);
  const [roleTreeVisible, setRoleTreeVisible] = useState<boolean>(false);

  const [roleFormType, setRoleOperationType] = useState<OperationType>();
  const roleModalActionRef = useRef<ActionType>();
  const [roleForm] = Form.useForm();
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
      dataIndex: 'roleName',
      valueType: 'text',
    },
    {
      title: '角色中文名',
      dataIndex: 'roleCnName',
      valueType: 'text',
    },
    {
      title: '父角色 ID',
      dataIndex: 'parentId',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '父角色名',
      dataIndex: 'parentRoleName',
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
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtUpdate',
      key: 'gmtUpdate',
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
              roleForm.setFieldsValue(role);
              setUpdateRoleInfo(role);
              setRoleOperationType(OperationType.UPDATE);
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
              deleteRole(record.id).then(() => refreshPageInfo());
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

  function createRole() {
    setRoleOperationType(OperationType.CREATE);
    setRoleModalVisible(true);
  }

  function handleRoleFormCancel() {
    setRoleModalVisible(false);
  }

  function refreshPageInfo() {
    roleModalActionRef?.current?.reload();
  }

  function showAllRoleByTree() {
    setRoleTreeVisible(true);
  }

  return (
    <PageContainer>
      <ProTable<QuietRole>
        actionRef={roleModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => queryRole({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="tree" onClick={showAllRoleByTree}>
            所有角色
          </Button>,
          <Button type="primary" key="create" onClick={createRole}>
            <PlusOutlined /> 新建角色
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {roleFormVisible && (
        <RoleForm
          visible={roleFormVisible}
          onCancel={handleRoleFormCancel}
          operationType={roleFormType}
          form={roleForm}
          updateInfo={updateRoleInfo}
          afterAction={refreshPageInfo}
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
