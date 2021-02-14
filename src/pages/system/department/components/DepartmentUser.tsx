import type { ReactText } from 'react';
import React, { useRef, useState } from 'react';
import { Button, message, Modal, Popconfirm } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { pageUser, addUsers, removeUsers } from '@/services/system/QuietDepartment';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import UserSelect from '@/pages/system/userinfo/components/UserSelect';
import { Gender, Weather } from '@/services/system/Enums';

type DepartmentUserProps = {
  department: SystemEntities.QuietDepartment | undefined;
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
          <Popconfirm
            key="delete"
            placement="top"
            title="确认在该部门移除该用户吗？"
            onConfirm={async () => {
              if (department) {
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
    if (department) {
      await addUsers(department.id, userIds);
      userModalActionRef.current?.reload();
      setAddDepartmentUserVisible(false);
    }
  }

  async function confirmRemoveUsers() {
    if (department) {
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
      message.info('请选择要移除的部门成员');
    }
  }

  return (
    <Modal
      destroyOnClose
      width={'80%'}
      footer={null}
      title={`部门 ${department?.departmentName} 的成员信息`}
      visible={visible}
      onCancel={handleOnCancel}
      onOk={handleOnOk}
    >
      <ProTable<SystemEntities.QuietUser>
        actionRef={userModalActionRef}
        rowSelection={{ onChange: (keys) => setSelectedRowKeys(keys) }}
        tableAlertRender={false}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) =>
          pageUser({ departmentId: department?.id, ...params, params, sorter, filter })
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
