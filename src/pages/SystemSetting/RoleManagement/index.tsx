import TreeTransfer from '@/components/TreeTransfer';
import {
  addRole,
  deleteRole,
  listPermission,
  pageRole,
  treeRoles,
  updatePermissions,
  updateRole,
} from '@/services/quiet/roleController';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, Form, Input, Popconfirm, TreeDataNode } from 'antd';
import React, { useRef, useState } from 'react';

const RoleManagement: React.FC = () => {
  const ref = useRef<ActionType>();
  const [form] = Form.useForm<API.AddRole>();
  const [editForm] = Form.useForm<API.UpdateRole>();
  const [parentCode, setParentCode] = useState<string>();
  const { treePermissions } = useModel('permission');
  const [rolePermissionIds, setRolePermissionIds] = useState<string[]>([]);
  const onChange = (keys: string[]) => {
    setRolePermissionIds(keys);
  };

  const flattenTreePermissions = (list: API.TreePermission[] = []) => {
    const tmp: TreeDataNode[] = [];
    function flatten(list: API.TreePermission[] = []) {
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

  const columns: ProColumns<API.RoleVO>[] = [
    {
      title: 'ID',
      valueType: 'text',
      dataIndex: 'id',
      copyable: true,
      editable: false,
    },
    {
      title: '角色名',
      valueType: 'text',
      dataIndex: 'name',
      ellipsis: true,
      copyable: true,
    },
    {
      title: 'Value',
      valueType: 'text',
      dataIndex: 'value',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '角色编码',
      valueType: 'text',
      dataIndex: 'code',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '父角色ID',
      valueType: 'text',
      dataIndex: 'parentId',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '创建时间',
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
      render: (_, record) => [
        <ModalForm<API.UpdateRole>
          form={editForm}
          key={'editRole'}
          width={'39%'}
          title={'编辑角色'}
          layout={'horizontal'}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          trigger={
            <a
              key="edit"
              onClick={() => {
                editForm.setFieldsValue(record);
                editForm.setFieldValue('code', record.code.substring(record.code.length - 2));
                setParentCode(record.code.substring(0, record.code.length - 2));
              }}
            >
              编辑
            </a>
          }
          submitter={{
            render: (_, defaultDom) => {
              return [
                <Button
                  key="reset"
                  onClick={() => {
                    editForm.resetFields();
                    setParentCode(undefined);
                  }}
                >
                  重置
                </Button>,
                ...defaultDom,
              ];
            },
          }}
          onFinish={(formData) =>
            updateRole(formData).then(() => {
              editForm.resetFields();
              ref.current?.reload();
              return true;
            })
          }
        >
          <ProFormText hidden name={'id'} />
          <ProFormText name={'name'} label={'角色名称'} rules={[{ required: true, max: 16 }]} />
          <ProFormText name={'value'} label={'角色Value'} rules={[{ required: true, max: 32 }]} />
          <ProFormTreeSelect
            name={'parentId'}
            label={'父角色'}
            debounceTime={600}
            request={() => treeRoles()}
            fieldProps={{
              treeLine: true,
              fieldNames: {
                value: 'id',
                label: 'name',
              },
              onSelect: (_, node) => setParentCode(node.code),
            }}
          />
          <ProForm.Item label={'角色编码'} name={'code'} rules={[{ required: true, len: 2 }]}>
            <Input addonBefore={parentCode} placeholder={'请输入'} />
          </ProForm.Item>
          <ProFormDigit name={'ordinal'} label={'排序'} min={0} rules={[{ required: true }]} />
        </ModalForm>,
        <ModalForm
          key={'editRolePermission'}
          title="编辑权限"
          onFinish={() =>
            updatePermissions({ roleId: record.id, permissionIds: rolePermissionIds }).then(
              () => true,
            )
          }
          trigger={
            <a
              type="primary"
              onClick={() =>
                listPermission({ roleId: record.id }).then((resp) => setRolePermissionIds(resp))
              }
            >
              编辑权限
            </a>
          }
        >
          <TreeTransfer
            dataSource={flattenTreePermissions(treePermissions())}
            targetKeys={rolePermissionIds}
            onChange={onChange}
          />
        </ModalForm>,
        <Popconfirm
          key={'delete'}
          title="删除角色"
          style={{ width: '100vw' }}
          description="删除该角色后，与之关联的用户将不再拥有该角色，确定删除该角色?"
          onConfirm={() => {
            deleteRole({ id: record.id }).then(() => ref.current?.reload());
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.RoleVO>
        bordered
        cardBordered
        rowKey={'id'}
        actionRef={ref}
        columns={columns}
        request={(params) => pageRole({ pageRole: params })}
        columnsState={{
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
        }}
        toolBarRender={() => [
          <ModalForm<API.AddRole>
            form={form}
            key={'add'}
            width={'39%'}
            title={'新建角色'}
            layout={'horizontal'}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            trigger={
              <Button key={'add'} icon={<PlusOutlined />} type={'primary'}>
                新建角色
              </Button>
            }
            onOpenChange={() => {
              setParentCode(undefined);
              form.resetFields();
            }}
            submitter={{
              render: (_, defaultDom) => {
                return [
                  <Button
                    key="reset"
                    onClick={() => {
                      form.resetFields();
                      setParentCode(undefined);
                    }}
                  >
                    重置
                  </Button>,
                  ...defaultDom,
                ];
              },
            }}
            onFinish={(formData) =>
              addRole(formData).then(() => {
                form.resetFields();
                ref.current?.reload();
                return true;
              })
            }
          >
            <ProFormText name={'name'} label={'角色名称'} rules={[{ required: true, max: 16 }]} />
            <ProFormText name={'value'} label={'角色Value'} rules={[{ required: true, max: 32 }]} />
            <ProFormTreeSelect
              name={'parentId'}
              label={'父角色'}
              debounceTime={600}
              request={() => treeRoles()}
              fieldProps={{
                treeLine: true,
                fieldNames: {
                  value: 'id',
                  label: 'name',
                },
                onSelect: (_, node) => setParentCode(node.code),
              }}
            />
            <ProForm.Item label={'角色编码'} name={'code'} rules={[{ required: true, len: 2 }]}>
              <Input addonBefore={parentCode} placeholder={'请输入'} />
            </ProForm.Item>
            <ProFormDigit name={'ordinal'} label={'排序'} min={0} rules={[{ required: true }]} />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};

export default RoleManagement;
