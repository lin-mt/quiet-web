import React, { useRef, useState } from 'react';
import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ColumnsState, ProColumns } from '@ant-design/pro-table';
import { queryPermission } from '@/services/system/QuitePermission';
import { PageContainer } from '@ant-design/pro-layout';

const PermissionConfig: React.FC<any> = () => {
  const permissionModalActionRef = useRef<ActionType>();
  const [permissionForm] = Form.useForm();
  const columns: ProColumns<SystemEntities.QuitePermission>[] = [
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
      title: 'preFilterValue',
      dataIndex: 'preFilterValue',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      search: false,
    },
    {
      title: 'preFilterFilterTarget',
      dataIndex: 'preFilterFilterTarget',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      search: false,
    },
    {
      title: 'preAuthorizeValue',
      dataIndex: 'preAuthorizeValue',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      search: false,
    },
    {
      title: 'postFilterValue',
      dataIndex: 'postFilterValue',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      search: false,
    },
    {
      title: 'postAuthorizeValue',
      dataIndex: 'postAuthorizeValue',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      search: false,
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
      render: () => {
        return [<a key='update' onClick={() => {
          const role = {};
          permissionForm.setFieldsValue(role);
        }}>修改</a>,
          <a key='delete'>删除</a>];
      },
    },
  ];

  const [columnsStateMap, setColumnsStateMap] = useState<{
    [key: string]: ColumnsState;
  }>({
    gmtCreate: {
      show: false,
    },
    gmtUpdate: {
      show: false,
    }
  });
  return (
    <PageContainer>
      <ProTable<SystemEntities.QuitePermission, { keyWord?: string }>
        actionRef={permissionModalActionRef}
        rowKey={record => record.id}
        request={(params, sorter, filter) =>
          queryPermission({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create">
            <PlusOutlined /> 新增配置
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
    </PageContainer>
  );
};

export default PermissionConfig;
