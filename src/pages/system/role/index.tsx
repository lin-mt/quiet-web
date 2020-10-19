import React, { useRef } from 'react';
import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryRole } from '@/services/system/QuiteRole';
import { PageContainer } from '@ant-design/pro-layout';

const RoleManagement: React.FC<any> = () => {
  const roleModalActionRef = useRef<ActionType>();
  const [roleForm] = Form.useForm();
  const columns: ProColumns<SystemEntities.QuiteRole>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
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
    },
    {
      title: '父角色名',
      dataIndex: 'parentRoleName',
      valueType: 'text',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
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
      render: () => {
        return [<a key='update' onClick={() => {
          const role = {};
          roleForm.setFieldsValue(role);
        }}>修改</a>,
          <a key='delete'>删除</a>];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<SystemEntities.QuiteRole>
        actionRef={roleModalActionRef}
        rowKey={record => record.id}
        request={(params, sorter, filter) =>
          queryRole({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create">
            <PlusOutlined /> 新建角色
          </Button>,
        ]}
        columns={columns}
      />
    </PageContainer>
  );
};

export default RoleManagement;
