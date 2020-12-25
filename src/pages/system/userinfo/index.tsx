import React, { useRef, useState } from 'react';
import { Button, Form, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryUser, deleteUser } from '@/services/system/QuietUser';
import { Gender, Weather } from '@/services/system/Dictionary';
import { OperationType } from '@/types/Type';
import UserForm from './components/UserForm';

const UserInfo: React.FC<any> = () => {
  const [updateUserInfo, setUpdateUserInfo] = useState<SystemEntities.QuietUser>();
  const [userFormVisible, setUserModalVisible] = useState<boolean>(false);
  const [userFormType, setUserModalType] = useState<OperationType>();
  const userModalActionRef = useRef<ActionType>();
  const [userForm] = Form.useForm();
  const columns: ProColumns<SystemEntities.QuietUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
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
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueEnum: Gender,
      renderText: (gender) => {
        return gender?.code;
      },
    },
    {
      title: '电话号码',
      dataIndex: 'phoneNumber',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'emailAddress',
      valueType: 'text',
    },
    {
      title: '账号是否到期',
      dataIndex: 'accountExpired',
      valueEnum: Weather,
      renderText: (accountExpired) => {
        return accountExpired?.code;
      },
    },
    {
      title: '账号是否被锁',
      dataIndex: 'accountLocked',
      valueEnum: Weather,
      renderText: (accountLocked) => {
        return accountLocked?.code;
      },
    },
    {
      title: '密码是否过期',
      dataIndex: 'credentialsExpired',
      valueEnum: Weather,
      renderText: (credentialsExpired) => {
        return credentialsExpired?.code;
      },
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
      title: '账号是否启用',
      dataIndex: 'enabled',
      valueEnum: Weather,
      renderText: (enabled) => {
        return enabled.code;
      },
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
              const userInfo = {
                ...record,
                gender: record.gender?.code,
                accountExpired: record.accountExpired?.code,
                accountLocked: record.accountLocked?.code,
                credentialsExpired: record.credentialsExpired?.code,
                enabled: record.enabled?.code,
              };
              userForm.setFieldsValue(userInfo);
              setUpdateUserInfo(userInfo);
              setUserModalType(OperationType.UPDATE);
              setUserModalVisible(true);
            }}
          >
            修改
          </a>,
          <Popconfirm
            key="delete"
            placement="topLeft"
            title="确认删除该用户及该用户的相关信息吗？"
            onConfirm={() => {
              deleteUser(record.id).then(() => refreshPageInfo());
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

  function createUser() {
    setUserModalType(OperationType.CREATE);
    setUserModalVisible(true);
  }

  function handleUserFormCancel() {
    setUserModalVisible(false);
  }

  function refreshPageInfo() {
    userModalActionRef?.current?.reload();
  }

  return (
    <PageContainer>
      <ProTable<SystemEntities.QuietUser>
        actionRef={userModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => queryUser({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={createUser}>
            <PlusOutlined /> 新建用户
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {userFormVisible && (
        <UserForm
          visible={userFormVisible}
          onCancel={handleUserFormCancel}
          operationType={userFormType}
          form={userForm}
          updateInfo={updateUserInfo}
          afterAction={refreshPageInfo}
        />
      )}
    </PageContainer>
  );
};

export default UserInfo;
