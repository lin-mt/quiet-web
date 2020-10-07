import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { queryUser } from '@/services/system/QuiteUser';
import { Gender, Weather } from '@/services/system/Dictionary';

const TableList: React.FC<{}> = () => {
  const columns: ProColumns<SystemEntities.QuiteUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'textarea',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'avatar',
      hideInSearch: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: Gender,
    },
    {
      title: '电话号码',
      dataIndex: 'phoneNumber',
      valueType: 'textarea',
    },
    {
      title: '邮箱地址',
      dataIndex: 'emailAddress',
      valueType: 'textarea',
      hideInForm: true,
    },
    {
      title: '账号是否到期',
      dataIndex: 'accountExpired',
      valueEnum: Weather,
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
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtUpdate',
      valueType: 'dateTime',
      hideInSearch: true,
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
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
