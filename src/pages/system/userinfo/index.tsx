import React, { useRef, useState } from 'react';
import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryUser } from '@/services/system/QuiteUser';
import { Gender, Weather } from '@/services/system/Dictionary';
import UserForm, { UserFormType } from './components/UserForm';

const TableList: React.FC<any> = () => {
  const [updateUserInfo, setUpdateUserInfo] = useState<SystemEntities.QuiteUser>();
  const [userFormVisible, setUserModalVisible] = useState<boolean>(false);
  const [userFormType, setUserModalType] = useState<UserFormType>();
  const userModalActionRef = useRef<ActionType>();
  const [userForm] = Form.useForm();
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
      renderText: (gender) => {
        return gender?.value;
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
      filters: true,
      dataIndex: 'accountExpired',
      valueEnum: Weather,
      renderText: (accountExpired) => {
        return accountExpired?.value;
      },
      hideInForm: true,
    },
    {
      title: '账号是否被锁',
      dataIndex: 'accountLocked',
      valueEnum: Weather,
      renderText: (accountLocked) => {
        return accountLocked?.value;
      },
    },
    {
      title: '密码是否过期',
      dataIndex: 'credentialsExpired',
      valueEnum: Weather,
      renderText: (credentialsExpired) => {
        return credentialsExpired?.value;
      },
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
      renderText: (enabled) => {
        return enabled.value;
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      render: (_, record) => {
        return [<a key='update' onClick={() => {
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
          setUserModalType(UserFormType.UPDATE);
          setUserModalVisible(true);
        }}>修改</a>,
          <a key='delete'>删除</a>];
      },
    },
  ];

  function createUser() {
    setUserModalType(UserFormType.CREATE);
    setUserModalVisible(true);
  }

  function handleUserFormCancel() {
    setUserModalVisible(false);
  }

  return (
    <PageContainer>
      <ProTable<SystemEntities.QuiteUser>
        actionRef={userModalActionRef}
        rowKey={record => record.id}
        request={(params, sorter, filter) =>
          queryUser({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={createUser}>
            <PlusOutlined /> 新建用户
          </Button>,
        ]}
        columns={columns}
      />
      {userFormVisible &&
      <UserForm visible={userFormVisible} onCancel={handleUserFormCancel} userFormType={userFormType} form={userForm}
                updateUserInfo={updateUserInfo} />
      }

    </PageContainer>
  );
};

export default TableList;
