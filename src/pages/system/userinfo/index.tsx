import type { ReactText } from 'react';
import React, { useRef, useState } from 'react';
import { Button, Popconfirm, Space, Tag } from 'antd';
import { CloseOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { pageUser, deleteUser, removeRole, addRoles } from '@/services/system/QuietUser';
import UserForm from './components/UserForm';
import RoleTree from '@/pages/system/role/components/RoleTree';
import { Gender } from '@/services/system/Enums';
import {
  accountExpiredStatus,
  accountLockedStatus,
  credentialsExpiredStatus,
  enableStatus,
} from '@/services/system/Status';
import type { QuietUser } from '@/services/system/EntityType';

const UserInfo: React.FC<any> = () => {
  const [updateUserInfo, setUpdateUserInfo] = useState<QuietUser>();
  const [userFormVisible, setUserModalVisible] = useState<boolean>(false);
  const [roleTreeVisible, setRoleTreeVisible] = useState<boolean>(false);
  const [addRoleUserId, setAddRoleUserId] = useState<string | null>(null);
  const userModalActionRef = useRef<ActionType>();

  async function confirmRemoveUserRole(userId: string | undefined, roleId: string | undefined) {
    if (userId && roleId) {
      await removeRole(userId, roleId);
      userModalActionRef.current?.reload();
    }
  }

  function addUserRole(userId: string | undefined) {
    if (userId) {
      setAddRoleUserId(userId);
      setRoleTreeVisible(true);
    }
  }

  const columns: ProColumns<QuietUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'text',
    },
    {
      title: '姓名',
      dataIndex: 'full_name',
      valueType: 'text',
    },
    {
      title: '密码',
      dataIndex: 'secret_code',
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
    },
    {
      title: '角色',
      dataIndex: 'authorities',
      search: false,
      render: (_, record) => (
        <Space direction={'vertical'}>
          {!(record.authorities && record.authorities.length > 0)
            ? '-'
            : record.authorities.map(({ id, role_name, role_cn_name }) => (
                <Tag
                  color={'#108EE9'}
                  key={role_name}
                  closable={true}
                  onClose={(e) => e.preventDefault()}
                  closeIcon={
                    <Popconfirm
                      title={`确定删除用户 ${record.full_name} 的 ${role_cn_name} 角色吗？`}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      /* eslint-disable-next-line @typescript-eslint/no-invalid-this */
                      onConfirm={confirmRemoveUserRole.bind(this, record.id, id)}
                    >
                      <CloseOutlined />
                    </Popconfirm>
                  }
                >
                  {role_name}
                </Tag>
              ))}
        </Space>
      ),
    },
    {
      title: '电话号码',
      dataIndex: 'phone_number',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email_address',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '账号到期',
      dataIndex: 'account_expired',
      valueType: 'select',
      valueEnum: accountExpiredStatus,
    },
    {
      title: '账号被锁',
      dataIndex: 'account_locked',
      valueType: 'select',
      valueEnum: accountLockedStatus,
    },
    {
      title: '密码过期',
      dataIndex: 'credentials_expired',
      valueType: 'select',
      valueEnum: credentialsExpiredStatus,
    },
    {
      title: '账号启用',
      dataIndex: 'enabled',
      valueType: 'select',
      valueEnum: enableStatus,
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
          /* eslint-disable-next-line @typescript-eslint/no-invalid-this */
          <a key="roleInfo" onClick={addUserRole.bind(this, record.id)}>
            添加角色
          </a>,
          <a
            key="update"
            onClick={() => {
              const userInfo = {
                ...record,
                gender: record.gender,
                accountExpired: record.account_expired,
                accountLocked: record.account_locked,
                credentialsExpired: record.credentials_expired,
                enabled: record.enabled,
              };
              setUpdateUserInfo(userInfo);
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
              if (record.id) {
                deleteUser(record.id).then(() => userModalActionRef.current?.reload());
              }
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

  function createUser() {
    setUpdateUserInfo(undefined);
    setUserModalVisible(true);
  }

  function handleRoleTreeOnCancel() {
    setAddRoleUserId(null);
    setRoleTreeVisible(false);
  }

  async function handleRoleTreeOnOk(keys?: ReactText[]) {
    const roles: { user_id: string; role_id: ReactText }[] = [];
    if (keys && addRoleUserId) {
      keys.forEach((key) => {
        roles.push({ user_id: addRoleUserId, role_id: key });
      });
      await addRoles(roles);
      userModalActionRef.current?.reload();
      setAddRoleUserId(null);
      setRoleTreeVisible(false);
    }
  }

  return (
    <PageContainer>
      <ProTable<QuietUser>
        actionRef={userModalActionRef}
        rowKey={(record, index) => (record.id ? record.id : `${index}`)}
        request={(params, sorter, filter) => pageUser({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={createUser}>
            <PlusOutlined /> 新建用户
          </Button>,
        ]}
        columns={columns}
        columnsState={{ value: columnsStateMap }}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {userFormVisible && (
        <UserForm
          visible={userFormVisible}
          onCancel={() => setUserModalVisible(false)}
          isUserRegister={false}
          updateInfo={updateUserInfo}
          afterAction={() => userModalActionRef.current?.reload()}
        />
      )}
      {roleTreeVisible && (
        <RoleTree
          visible={roleTreeVisible}
          maskClosable={false}
          closable={false}
          multiple={true}
          onCancel={handleRoleTreeOnCancel}
          onOk={handleRoleTreeOnOk}
          afterClose={handleRoleTreeOnCancel}
        />
      )}
    </PageContainer>
  );
};

export default UserInfo;
