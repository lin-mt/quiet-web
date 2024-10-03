import {
  addRepository,
  deleteRepository,
  pageRepository,
  updateRepository,
} from '@/services/quiet/repositoryController';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ColumnsState,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Form, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const RepositoryManagement: React.FC = () => {
  const ref = useRef<ActionType>();
  const [form] = Form.useForm<API.AddRepository>();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    description: {
      show: false,
    },
    option: { fixed: 'right', disable: true },
  });

  const columns: ProColumns<API.RepositoryVO>[] = [
    {
      title: 'ID',
      valueType: 'text',
      dataIndex: 'id',
      copyable: true,
      editable: false,
    },
    {
      title: '仓库名称',
      valueType: 'text',
      dataIndex: 'name',
      ellipsis: true,
      copyable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入仓库名称',
          },
          {
            max: 30,
            message: '长度不能超过 30',
          },
        ],
      },
    },
    {
      title: '仓库类型',
      valueType: 'select',
      dataIndex: 'type',
      valueEnum: {
        GITLAB: {
          text: 'GitLab',
        },
        GITHUB: {
          text: 'GitHub',
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择仓库类型',
          },
        ],
      },
    },
    {
      title: '构建工具',
      valueType: 'select',
      dataIndex: 'buildTool',
      valueEnum: {
        MAVEN: {
          text: 'Maven',
        },
        GRADLE: {
          text: 'Gradle',
        },
        NPM: {
          text: 'npm',
        },
        YARN: {
          text: 'Yarn',
        },
        PNPM: {
          text: 'pnpm',
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请选择构建工具',
          },
        ],
      },
    },
    {
      title: '描述',
      valueType: 'text',
      ellipsis: true,
      search: false,
      dataIndex: 'description',
      formItemProps: {
        rules: [
          {
            max: 255,
            message: '描述不能超过 255 个字符',
          },
        ],
      },
    },
    {
      title: '操作',
      disable: true,
      valueType: 'option',
      key: 'option',
      render: (_text, record, _, action) => [
        <a
          key="edit"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key={'delete'}
          title="删除仓库"
          style={{ width: '100vw' }}
          onConfirm={() => {
            deleteRepository({ id: record.id }).then(() => ref.current?.reload());
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  useEffect(() => {}, []);

  return (
    <PageContainer title={false}>
      <ProTable<API.RepositoryVO>
        bordered
        cardBordered
        rowKey={'id'}
        actionRef={ref}
        columns={columns}
        request={(params) => pageRepository({ pageRepository: params })}
        editable={{
          deleteText: <span style={{ color: 'red' }}>删除</span>,
          onSave: (_, record) =>
            updateRepository(record).then(() => {
              ref.current?.reload();
            }),
          onDelete: (_, record) =>
            deleteRepository({ id: record.id }).then(() => {
              ref.current?.reload();
            }),
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: setColumnsStateMap,
        }}
        toolBarRender={() => [
          <ModalForm<API.AddRepository>
            form={form}
            key={'add'}
            title={'添加仓库'}
            layout={'horizontal'}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            trigger={
              <Button key={'add'} icon={<PlusOutlined />} type={'primary'}>
                添加仓库
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
              addRepository(formData).then(() => {
                form.resetFields();
                ref.current?.reload();
                return true;
              })
            }
          >
            <ProFormText name="name" label="仓库名称" rules={[{ required: true, max: 30 }]} />
            <ProFormSelect
              name="type"
              label="仓库类型"
              valueEnum={{
                GITLAB: 'GitLab',
                GITHUB: 'GitHub',
              }}
              rules={[{ required: true }]}
            />
            <ProFormText name="url" label="仓库地址" rules={[{ required: true, max: 255 }]} />
            <ProFormSelect
              name="buildTool"
              label="构建工具"
              valueEnum={{
                MAVEN: 'Maven',
                GRADLE: 'Gradle',
                NPM: 'npm',
                YARN: 'Yarn',
                PNPM: 'pnpm',
              }}
              rules={[{ required: true }]}
            />
            <ProFormText name="username" label="用户名" rules={[{ required: true, max: 255 }]} />
            <ProFormText name="password" label="密码" rules={[{ required: true, max: 255 }]} />
            <ProFormText name="accessToken" label="Token" rules={[{ required: true, max: 255 }]} />
            <ProFormTextArea name="description" label="仓库描述" rules={[{ max: 255 }]} />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};

export default RepositoryManagement;
