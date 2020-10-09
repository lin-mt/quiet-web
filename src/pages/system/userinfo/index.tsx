import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { queryUser } from '@/services/system/QuiteUser';
import { Gender, Weather } from '@/services/system/Dictionary';
import CreateForm from './components/CreateForm';

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const columns: ProColumns<SystemEntities.QuiteUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'text',
    },
    {
      title: '密码',
      dataIndex: 'secretCode',
      valueType: 'text',
      search: false,
      hideInTable: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'avatar',
      search: false,
      hideInForm: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: Gender,
    },
    {
      title: '电话号码',
      dataIndex: 'phoneNumber',
      valueType: 'text',
    },
    {
      title: '邮箱地址',
      dataIndex: 'emailAddress',
      valueType: 'text',
    },
    {
      title: '账号是否到期',
      dataIndex: 'accountExpired',
      valueEnum: Weather,
      hideInForm: true,
    },
    {
      title: '账号是否被锁',
      dataIndex: 'accountLocked',
      valueEnum: Weather,
    },
    {
      title: '密码是否过期',
      dataIndex: 'credentialsExpired',
      valueEnum: Weather,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      valueType: 'dateTime',
      search: false,
      hideInForm: true,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtUpdate',
      valueType: 'dateTime',
      search: false,
      hideInForm: true,
    },
    {
      title: '账号是否启用',
      dataIndex: 'enabled',
      valueEnum: Weather,
    },
  ];

  return (
    <PageContainer>
      <ProTable<SystemEntities.QuiteUser>
        rowKey={record => record.id}
        request={(params, sorter, filter) =>
          queryUser({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        columns={columns}
      />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<SystemEntities.QuiteUser, SystemEntities.QuiteUser>
          rowKey="key"
          type="form"
          form={{ labelCol: { span: 4 }, wrapperCol: { span: 8 }, layout: 'inline' }}
          onSubmit={values => console.log(values)}
          columns={columns}
        />
      </CreateForm>
    </PageContainer>
  );
};

export default TableList;
