import {
  addPermission,
  deletePermission,
  pagePermission,
  treePermission,
  updatePermission,
} from '@/services/quiet/permissionController';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ColumnsState,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Form, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

const PermissionManagement: React.FC = () => {
  const ref = useRef<ActionType>();
  const [form] = Form.useForm<API.AddPermission>();
  const [editForm] = Form.useForm<API.UpdatePermission>();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    httpMethod: {
      show: false,
    },
    httpUrl: {
      show: false,
    },
    remark: {
      show: false,
    },
    option: { fixed: 'right', disable: true },
  });

  const columns: ProColumns<API.PermissionVO>[] = [
    {
      title: 'ID',
      valueType: 'text',
      dataIndex: 'id',
      copyable: true,
    },
    {
      title: '权限名',
      valueType: 'text',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '权限值',
      valueType: 'text',
      dataIndex: 'value',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '权限类型',
      valueType: 'select',
      dataIndex: 'type',
      valueEnum: {
        MENU: { text: '菜单' },
        BUTTON: { text: '按钮' },
        REQUEST: { text: '接口' },
      },
    },
    {
      title: '父权限ID',
      valueType: 'text',
      dataIndex: 'parentId',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '路径',
      valueType: 'text',
      dataIndex: 'path',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '请求方法',
      valueType: 'select',
      dataIndex: 'httpMethod',
      valueEnum: {
        GET: { text: 'GET' },
        POST: { text: 'POST' },
        PUT: { text: 'PUT' },
        DELETE: { text: 'DELETE' },
        HEAD: { text: 'HEAD' },
        PATCH: { text: 'PATCH' },
        OPTIONS: { text: 'OPTIONS' },
        TRACE: { text: 'TRACE' },
      },
    },
    {
      title: '请求URL',
      valueType: 'text',
      dataIndex: 'httpUrl',
    },
    {
      title: '备注',
      valueType: 'text',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <ModalForm<API.UpdatePermission>
          form={editForm}
          key={'editPermission'}
          width={'39%'}
          title={'编辑权限'}
          layout={'horizontal'}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          trigger={
            <a key="edit" onClick={() => editForm.setFieldsValue(record)}>
              编辑
            </a>
          }
          submitter={{
            render: (_, defaultDom) => {
              return [
                <Button key="reset" onClick={() => editForm.resetFields()}>
                  重置
                </Button>,
                ...defaultDom,
              ];
            },
          }}
          onFinish={(formData) =>
            updatePermission(formData).then(() => {
              editForm.resetFields();
              ref.current?.reload();
              return true;
            })
          }
        >
          <ProFormText hidden name={'id'} />
          <ProFormText name={'name'} label={'权限名称'} rules={[{ required: true, max: 16 }]} />
          <ProFormSelect
            name={'type'}
            label={'权限类型'}
            rules={[{ required: true }]}
            valueEnum={{
              MENU: { text: '菜单' },
              BUTTON: { text: '按钮' },
              REQUEST: { text: '接口' },
            }}
          />
          <ProFormTreeSelect
            name={'parentId'}
            label={'父权限'}
            debounceTime={600}
            request={() => treePermission()}
            fieldProps={{
              treeLine: true,
              fieldNames: {
                value: 'id',
                label: 'name',
              },
            }}
          />
          <ProFormText name={'value'} label={'权限值'} rules={[{ required: true, max: 255 }]} />
          <ProFormText name={'path'} label={'路径'} rules={[{ max: 255 }]} />
          <ProFormSelect
            name={'httpMethod'}
            label={'请求方法'}
            valueEnum={{
              GET: { text: 'GET' },
              POST: { text: 'POST' },
              PUT: { text: 'PUT' },
              DELETE: { text: 'DELETE' },
              HEAD: { text: 'HEAD' },
              PATCH: { text: 'PATCH' },
              OPTIONS: { text: 'OPTIONS' },
              TRACE: { text: 'TRACE' },
            }}
          />
          <ProFormText name={'httpUrl'} label={'请求地址'} rules={[{ max: 255 }]} />
          <ProFormDigit name={'ordinal'} label={'排序'} min={0} rules={[{ required: true }]} />
          <ProFormTextArea name={'remark'} label={'备注'} rules={[{ max: 255 }]} />
        </ModalForm>,
        <Popconfirm
          key={'delete'}
          title="删除权限"
          style={{ width: '100vw' }}
          description="删除该权限后，与之关联的角色将不再拥有该权限，确定删除该权限?"
          onConfirm={() => {
            deletePermission({ id: record.id }).then(() => ref.current?.reload());
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.PermissionVO>
        bordered
        cardBordered
        rowKey={'id'}
        actionRef={ref}
        columns={columns}
        request={(params) => pagePermission({ pagePermission: params })}
        columnsState={{
          value: columnsStateMap,
          onChange: setColumnsStateMap,
        }}
        toolBarRender={() => [
          <ModalForm<API.AddPermission>
            form={form}
            key={'add'}
            width={'39%'}
            title={'新增权限'}
            layout={'horizontal'}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            trigger={
              <Button key={'add'} icon={<PlusOutlined />} type={'primary'}>
                新增权限
              </Button>
            }
            onOpenChange={() => form.resetFields()}
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
              addPermission(formData).then(() => {
                form.resetFields();
                ref.current?.reload();
                return true;
              })
            }
          >
            <ProFormText name={'name'} label={'权限名称'} rules={[{ required: true, max: 16 }]} />
            <ProFormSelect
              name={'type'}
              label={'权限类型'}
              rules={[{ required: true }]}
              valueEnum={{
                MENU: { text: '菜单' },
                BUTTON: { text: '按钮' },
                REQUEST: { text: '接口' },
              }}
            />
            <ProFormTreeSelect
              name={'parentId'}
              label={'父权限'}
              debounceTime={600}
              request={() => treePermission()}
              fieldProps={{
                treeLine: true,
                fieldNames: {
                  value: 'id',
                  label: 'name',
                },
              }}
            />
            <ProFormText name={'value'} label={'权限值'} rules={[{ required: true, max: 255 }]} />
            <ProFormText name={'path'} label={'路径'} rules={[{ max: 255 }]} />
            <ProFormSelect
              name={'httpMethod'}
              label={'请求方法'}
              valueEnum={{
                GET: { text: 'GET' },
                POST: { text: 'POST' },
                PUT: { text: 'PUT' },
                DELETE: { text: 'DELETE' },
                HEAD: { text: 'HEAD' },
                PATCH: { text: 'PATCH' },
                OPTIONS: { text: 'OPTIONS' },
                TRACE: { text: 'TRACE' },
              }}
            />
            <ProFormText name={'httpUrl'} label={'请求地址'} rules={[{ max: 255 }]} />
            <ProFormDigit name={'ordinal'} label={'排序'} min={0} rules={[{ required: true }]} />
            <ProFormTextArea name={'remark'} label={'备注'} rules={[{ max: 255 }]} />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};

export default PermissionManagement;
