import React, { useRef, useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ColumnsState, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deletePermission, pagePermission } from '@/services/system/QuietPermission';
import { PageContainer } from '@ant-design/pro-layout';
import PermissionForm from '@/pages/system/permission/components/PermissionForm';
import type { QuietPermission } from '@/services/system/EntityType';

const PermissionConfig: React.FC<any> = () => {
  const [updatePermissionInfo, setUpdatePermissionInfo] = useState<QuietPermission>();
  const [permissionFormVisible, setPermissionModalVisible] = useState<boolean>(false);
  const permissionModalActionRef = useRef<ActionType>();
  const columns: ProColumns<QuietPermission>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '应用名称',
      dataIndex: 'application_name',
      valueType: 'text',
      copyable: true,
    },
    {
      title: 'urlPattern',
      dataIndex: 'url_pattern',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
    },
    {
      title: 'reqMethod',
      dataIndex: 'request_method',
      valueType: 'text',
    },
    {
      title: 'roleId',
      dataIndex: 'role_id',
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
              setUpdatePermissionInfo({ ...record });
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
              deletePermission(record.id).then(() => permissionModalActionRef?.current?.reload());
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

  function createPermission() {
    setUpdatePermissionInfo(undefined);
    setPermissionModalVisible(true);
  }

  return (
    <PageContainer>
      <ProTable<QuietPermission>
        actionRef={permissionModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => pagePermission({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={createPermission} icon={<PlusOutlined />}>
            新增配置
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {permissionFormVisible && (
        <PermissionForm
          visible={permissionFormVisible}
          onCancel={() => setPermissionModalVisible(false)}
          updateInfo={updatePermissionInfo}
          afterAction={() => permissionModalActionRef?.current?.reload()}
        />
      )}
    </PageContainer>
  );
};

export default PermissionConfig;
