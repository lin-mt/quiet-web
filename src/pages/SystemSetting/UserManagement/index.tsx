import TreeTransfer from '@/components/TreeTransfer';
import {
  deleteUser,
  listRoles,
  pageUser,
  registration,
  updateRoles,
  updateUser,
} from '@/services/quiet/userController';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Form, TreeDataNode } from 'antd';
import React, { useRef, useState } from 'react';

const UserManagement: React.FC = () => {
  const ref = useRef<ActionType>();
  const [form] = Form.useForm<API.UserDTO>();
  const { treeRoles } = useModel('role');

  const [userRoleIds, setUserRoleIds] = useState<string[]>([]);
  const onChange = (keys: string[]) => {
    setUserRoleIds(keys);
  };

  const flattenTreeRoles = (list: API.TreeRole[] = []) => {
    const tmp: TreeDataNode[] = [];
    function flatten(list: API.TreeRole[] = []) {
      list?.forEach((item) => {
        let node: any = item;
        node.key = node.id;
        node.title = node.name;
        if (!item.parentId) {
          tmp.push(node);
        }
        flatten(item.children);
      });
    }
    flatten(list);
    return tmp;
  };

  const columns: ProColumns<API.UserVO>[] = [
    {
      title: 'ID',
      valueType: 'text',
      dataIndex: 'id',
      copyable: true,
      editable: false,
    },
    {
      title: '用户名',
      valueType: 'text',
      dataIndex: 'username',
      ellipsis: true,
      copyable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入用户名',
          },
          {
            max: 16,
            message: '用户名长度不能超过 16',
          },
        ],
      },
    },
    {
      title: '账号过期',
      valueType: 'select',
      dataIndex: 'accountExpired',
      valueEnum: {
        NO: {
          text: '正常',
          status: 'success',
        },
        YES: {
          text: '过期',
          status: 'default',
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择账号是否过期',
          },
        ],
      },
    },
    {
      title: '账号锁定',
      valueType: 'select',
      dataIndex: 'accountLocked',
      valueEnum: {
        NO: {
          text: '正常',
          status: 'success',
        },
        YES: {
          text: '锁定',
          status: 'default',
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择是否锁定账号',
          },
        ],
      },
    },
    {
      title: '密码过期',
      valueType: 'select',
      dataIndex: 'credentialsExpired',
      valueEnum: {
        NO: {
          text: '正常',
          status: 'success',
        },
        YES: {
          text: '过期',
          status: 'default',
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择密码是否过期',
          },
        ],
      },
    },
    {
      title: '启用状态',
      valueType: 'select',
      dataIndex: 'enabled',
      onFilter: true,
      valueEnum: {
        YES: {
          text: '启用',
          status: 'success',
        },
        NO: {
          text: '禁用',
          status: 'default',
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择账号是否启用',
          },
        ],
      },
    },
    {
      title: '注册时间',
      editable: false,
      search: false,
      valueType: 'dateTime',
      dataIndex: 'gmtCreate',
    },
    {
      title: '操作',
      disable: true,
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="edit"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <ModalForm
          key={'editUserRole'}
          title="编辑角色"
          onFinish={() => updateRoles({ userId: record.id, roleIds: userRoleIds }).then(() => true)}
          trigger={
            <a
              type="primary"
              onClick={() => listRoles({ userId: record.id }).then((resp) => setUserRoleIds(resp))}
            >
              编辑角色
            </a>
          }
        >
          <TreeTransfer
            dataSource={flattenTreeRoles(treeRoles())}
            targetKeys={userRoleIds}
            onChange={onChange}
          />
        </ModalForm>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.UserVO>
        bordered
        cardBordered
        rowKey={'id'}
        actionRef={ref}
        columns={columns}
        request={(params) => pageUser({ pageUser: params })}
        editable={{
          deleteText: <a style={{ color: 'red' }}>删除</a>,
          onSave: (_, record) => updateUser(record),
          onDelete: (_, record) => deleteUser({ id: record.id }),
        }}
        columnsState={{
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
        }}
        toolBarRender={() => [
          <ModalForm<API.UserDTO>
            form={form}
            key={'add'}
            width={'30%'}
            title={'添加用户'}
            layout={'horizontal'}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            trigger={
              <Button key={'add'} icon={<PlusOutlined />} type={'primary'}>
                添加用户
              </Button>
            }
            submitter={{
              render: (_, defaultDom) => {
                return [
                  <Button key="reset" onClick={() => form.resetFields()}>
                    重置
                  </Button>,
                  ...defaultDom,
                ];
              },
            }}
            onFinish={(formData) =>
              registration(formData).then(() => {
                form.resetFields();
                ref.current?.reload();
                return true;
              })
            }
          >
            <ProFormText name="username" label="用户名" rules={[{ required: true, max: 16 }]} />
            <ProFormText.Password
              name="password"
              label="密码"
              rules={[{ required: true, max: 32 }]}
            />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};

export default UserManagement;
