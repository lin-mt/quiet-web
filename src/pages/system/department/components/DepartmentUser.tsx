import type { ReactText } from 'react';
import React, { useRef, useState } from 'react';
import { Button, message, Modal, Popconfirm } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { pageUser, addUsers, removeUsers } from '@/services/system/QuietDepartment';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import UserSelect from '@/pages/system/userinfo/components/UserSelect';
import { Gender } from '@/services/system/Enums';
import {
  accountExpiredStatus,
  accountLockedStatus,
  credentialsExpiredStatus,
  enableStatus,
} from '@/services/system/Status';
import type { QuietDepartment, QuietUser } from '@/services/system/EntityType';

type DepartmentUserProps = {
  department: QuietDepartment | undefined;
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
};

const DepartmentUser: React.FC<DepartmentUserProps> = (props) => {
  const { department, visible, onCancel, onOk } = props;
  const userModalActionRef = useRef<ActionType>();
  const [addDepartmentUserVisible, setAddDepartmentUserVisible] = useState<boolean>(false);
  const [confirmRemoveUsersVisible, setConfirmRemoveUsersVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([]);

  function handleOnCancel() {
    onCancel();
  }

  function handleOnOk() {
    onOk();
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
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      render: (_, record) => {
        return [
          <Popconfirm
            key="delete"
            placement="top"
            title="确认在该部门移除该用户吗？"
            onConfirm={async () => {
              if (department && department.id && record.id) {
                await removeUsers(department.id, [record.id]);
                userModalActionRef.current?.reload();
              }
            }}
          >
            <a key="delete">移除</a>
          </Popconfirm>,
        ];
      },
    },
  ];

  async function handleAddUserOk(value: any) {
    const userIds = value?.map((u: { value: string }) => u.value);
    if (department && department.id) {
      await addUsers(department.id, userIds);
      userModalActionRef.current?.reload();
      setAddDepartmentUserVisible(false);
    }
  }

  async function confirmRemoveUsers() {
    if (department && department.id) {
      const userIds: string[] = [];
      selectedRowKeys.forEach((v) => userIds.push(v.toString()));
      await removeUsers(department.id, userIds);
      setConfirmRemoveUsersVisible(false);
      userModalActionRef.current?.reload();
    }
  }

  function handleConfirmRemoveUsers() {
    if (selectedRowKeys.length > 0) {
      setConfirmRemoveUsersVisible(true);
    } else {
      message.info('请选择要移除的部门成员').then();
    }
  }

  return (
    <Modal
      destroyOnClose
      width={'80%'}
      footer={null}
      title={`部门 ${department?.department_name} 的成员信息`}
      visible={visible}
      onCancel={handleOnCancel}
      onOk={handleOnOk}
    >
      <ProTable<QuietUser>
        actionRef={userModalActionRef}
        rowSelection={{ onChange: (keys) => setSelectedRowKeys(keys) }}
        tableAlertRender={false}
        rowKey={(record, index) => {
          if (record.id) return record.id;
          else return `${index}`;
        }}
        request={(params, sorter, filter) =>
          pageUser({ id: department?.id, ...params, params, sorter, filter })
        }
        toolBarRender={() => [
          <span>已选 {selectedRowKeys.length} 项</span>,
          <Popconfirm
            placement={'top'}
            visible={confirmRemoveUsersVisible}
            title={`确认在该部门中移除所选的 ${selectedRowKeys.length} 名成员吗？`}
            onConfirm={confirmRemoveUsers}
            onCancel={() => setConfirmRemoveUsersVisible(false)}
          >
            <Button
              type={'primary'}
              danger={true}
              key={'remove'}
              onClick={handleConfirmRemoveUsers}
            >
              <DeleteOutlined /> 批量移除
            </Button>
          </Popconfirm>,
          <Button type="primary" key="create" onClick={() => setAddDepartmentUserVisible(true)}>
            <PlusOutlined /> 添加部门成员
          </Button>,
        ]}
        columns={columns}
      />
      {addDepartmentUserVisible && (
        <UserSelect
          modalTitle={'添加部门成员'}
          okText={'添加'}
          visible={addDepartmentUserVisible}
          onCancel={() => setAddDepartmentUserVisible(false)}
          onOk={handleAddUserOk}
        />
      )}
    </Modal>
  );
};

export default DepartmentUser;
