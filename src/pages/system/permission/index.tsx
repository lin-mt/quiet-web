import React, { useRef, useState } from 'react';
import { Button, Form, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ColumnsState, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deletePermission, queryPermission } from '@/services/system/QuietPermission';
import { PageContainer } from '@ant-design/pro-layout';
import { OperationType } from '@/types/Type';
import PermissionForm from '@/pages/system/permission/components/PermissionForm';
import type { QuietPermission } from '@/services/system/EntityType';

const PermissionConfig: React.FC<any> = () => {
  const [updatePermissionInfo, setUpdatePermissionInfo] = useState<QuietPermission>();
  const [permissionFormVisible, setPermissionModalVisible] = useState<boolean>(false);
  const [permissionFormType, setPermissionOperationType] = useState<OperationType>();
  const permissionModalActionRef = useRef<ActionType>();
  const [permissionForm] = Form.useForm();
  const columns: ProColumns<QuietPermission>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '应用名称',
      dataIndex: 'applicationName',
      valueType: 'text',
      copyable: true,
    },
    {
      title: 'urlPattern',
      dataIndex: 'urlPattern',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
    },
    {
      title: 'reqMethod',
      dataIndex: 'requestMethod',
      valueType: 'text',
    },
    {
      title: 'roleId',
      dataIndex: 'roleId',
      valueType: 'text',
      copyable: true,
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
      valueType: 'option',
      render: (_, record) => {
        return [
          <a
            key="update"
            onClick={() => {
              const role = { ...record };
              permissionForm.setFieldsValue(role);
              setUpdatePermissionInfo(role);
              setPermissionOperationType(OperationType.UPDATE);
              setPermissionModalVisible(true);
            }}
          >
            修改
          </a>,
          <Popconfirm
            key="delete"
            placement="topLeft"
            title="确认删除该配置信息吗？"
            onConfirm={() => {
              deletePermission(record.id).then(() => refreshPageInfo());
            }}
          >
            <a key="delete">删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];

  function refreshPageInfo() {
    permissionModalActionRef?.current?.reload();
  }

  function handlePermissionFormCancel() {
    setPermissionModalVisible(false);
  }

  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    gmtCreate: { show: false },
    gmtUpdate: { show: false },
  });

  function createPermission() {
    setPermissionOperationType(OperationType.CREATE);
    setPermissionModalVisible(true);
  }

  return (
    <PageContainer>
      <ProTable<QuietPermission>
        actionRef={permissionModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => queryPermission({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={createPermission}>
            <PlusOutlined /> 新增配置
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {permissionFormVisible && (
        <PermissionForm
          visible={permissionFormVisible}
          onCancel={handlePermissionFormCancel}
          form={permissionForm}
          operationType={permissionFormType}
          updateInfo={updatePermissionInfo}
          afterAction={refreshPageInfo}
        />
      )}
    </PageContainer>
  );
};

export default PermissionConfig;
