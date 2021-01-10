import type { ReactText } from 'react';
import React, { useRef, useState } from 'react';
import { Button, Form, Popconfirm, Space, Tag } from 'antd';
import { CloseOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryUser, deleteUser, removeRole, addRoles } from '@/services/system/QuietUser';
import { Gender, Weather } from '@/services/system/Dictionary';
import { OperationType } from '@/types/Type';
import UserForm from './components/UserForm';
import { Tooltip } from 'antd';
import RoleTree from '@/pages/system/role/components/RoleTree';

const UserInfo: React.FC<any> = () => {
  const [updateUserInfo, setUpdateUserInfo] = useState<SystemEntities.QuietUser>();
  const [userFormVisible, setUserModalVisible] = useState<boolean>(false);
  const [roleTreeVisible, setRoleTreeVisible] = useState<boolean>(false);
  const [addRoleUserId, setAddRoleUserId] = useState<string | null>(null);
  const [userFormType, setUserModalType] = useState<OperationType>();
  const userModalActionRef = useRef<ActionType>();
  const [userForm] = Form.useForm();

  async function confirmRemoveUserRole(userId: string, roleId: string) {
    await removeRole(userId, roleId);
    refreshPageInfo();
  }

  function addUserRole(userId: string) {
    setAddRoleUserId(userId);
    setRoleTreeVisible(true);
  }

  const columns: ProColumns<SystemEntities.QuietUser>[] = [
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
    },
    {
      title: '角色',
      dataIndex: 'authorities',
      search: false,
      render: (_, record) => (
        <Space>
          {record.authorities
            ? record.authorities.map(({ id, roleName, roleCnName }) => (
                <Tooltip placement="bottom" title={roleCnName} key={roleName}>
                  <Tag
                    color={'#108EE9'}
                    key={roleName}
                    closable={true}
                    onClose={(e) => e.preventDefault()}
                    closeIcon={
                      <Popconfirm
                        title={`确定删除用户 ${record.username} 的 ${roleCnName} 角色吗？`}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        /* eslint-disable-next-line @typescript-eslint/no-invalid-this */
                        onConfirm={confirmRemoveUserRole.bind(this, record.id, id)}
                      >
                        <CloseOutlined />
                      </Popconfirm>
                    }
                  >
                    {roleName}
                  </Tag>
                </Tooltip>
              ))
            : '-'}
        </Space>
      ),
    },
    {
      title: '电话号码',
      dataIndex: 'phoneNumber',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'emailAddress',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '账号到期',
      dataIndex: 'accountExpired',
      valueEnum: Weather,
    },
    {
      title: '账号被锁',
      dataIndex: 'accountLocked',
      valueEnum: Weather,
    },
    {
      title: '密码过期',
      dataIndex: 'credentialsExpired',
      valueEnum: Weather,
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
      title: '账号启用',
      dataIndex: 'enabled',
      valueEnum: Weather,
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
    userModalActionRef.current?.reload();
  }

  function handleRoleTreeOnCancel() {
    setAddRoleUserId(null);
    setRoleTreeVisible(false);
  }

  async function handleRoleTreeOnOk(keys?: ReactText[]) {
    const addEntities: { userId: string | null; roleId: ReactText }[] = [];
    if (keys) {
      keys.forEach((key) => {
        addEntities.push({ userId: addRoleUserId, roleId: key });
      });
      await addRoles(addEntities);
      refreshPageInfo();
      setAddRoleUserId(null);
      setRoleTreeVisible(false);
    }
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
      {roleTreeVisible && (
        <RoleTree
          visible={roleTreeVisible}
          maskClosable={false}
          closable={false}
          multiple={true}
          onCancel={handleRoleTreeOnCancel}
          onOk={handleRoleTreeOnOk}
        />
      )}
    </PageContainer>
  );
};

export default UserInfo;
