import DebounceSelect from '@/components/DebounceSelect';
import {
  addProject,
  deleteProject,
  getProjectDetail,
  pageProject,
  updateProject,
  updateProjectMembers,
} from '@/services/quiet/projectController';
import { listUser } from '@/services/quiet/userController';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormField,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import React, { useRef } from 'react';

const ProjectManagement: React.FC = () => {
  const ref = useRef<ActionType>();
  const [form] = Form.useForm<API.AddProject>();
  const [editForm] = Form.useForm<API.ProjectDetail>();

  const columns: ProColumns<API.ProjectVO>[] = [
    {
      title: 'ID',
      valueType: 'text',
      dataIndex: 'id',
      copyable: true,
      editable: false,
    },
    {
      title: '项目名称',
      valueType: 'text',
      dataIndex: 'name',
      ellipsis: true,
      copyable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入项目名称',
          },
          {
            max: 30,
            message: '用户名长度不能超过 30',
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
      title: 'Git',
      valueType: 'text',
      dataIndex: 'gitAddress',
      ellipsis: true,
      copyable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入git地址',
          },
        ],
      },
    },
    {
      title: '描述',
      valueType: 'text',
      ellipsis: true,
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
          key={'editMember'}
          form={editForm}
          title="编辑项目成员"
          onFinish={() =>
            updateProjectMembers({
              projectId: record.id,
              memberIds: editForm.getFieldValue('members')?.map((m: any) => m.value),
            }).then(() => true)
          }
          trigger={
            <a
              type="primary"
              onClick={() =>
                getProjectDetail({ id: record.id }).then((resp) => {
                  const formValue = resp as any;
                  formValue.members = resp.members?.map((m) => {
                    return { value: m.id, label: m.username };
                  });
                  editForm.setFieldsValue(formValue);
                })
              }
            >
              编辑成员
            </a>
          }
        >
          <ProFormText readonly name={'name'} label={'项目名称'} />
          <ProFormText readonly name="gitAddress" label="Git" />
          <ProFormField name={'members'} label="项目成员">
            <DebounceSelect
              mode="multiple"
              placeholder={'请输入用户名'}
              fetchOptions={(value) =>
                listUser({ username: value }).then((resp) =>
                  resp?.map((u) => {
                    return { value: u.id, label: u.username };
                  }),
                )
              }
            />
          </ProFormField>
        </ModalForm>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.ProjectVO>
        bordered
        cardBordered
        rowKey={'id'}
        actionRef={ref}
        columns={columns}
        request={(params) => pageProject({ pageProjectFilter: params })}
        editable={{
          deleteText: <a style={{ color: 'red' }}>删除</a>,
          onSave: (_, record) => updateProject(record),
          onDelete: (_, record) => deleteProject({ id: record.id }),
        }}
        columnsState={{
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
        }}
        toolBarRender={() => [
          <ModalForm<API.AddProject>
            form={form}
            key={'add'}
            title={'添加项目'}
            layout={'horizontal'}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            trigger={
              <Button key={'add'} icon={<PlusOutlined />} type={'primary'}>
                添加项目
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
              addProject(formData).then(() => {
                form.resetFields();
                ref.current?.reload();
                return true;
              })
            }
          >
            <ProFormText name="name" label="项目名称" rules={[{ required: true, max: 30 }]} />
            <ProFormSelect
              name="buildTool"
              label="构建工具"
              valueEnum={{
                MAVEN: 'Maven',
                GRADLE: 'Gradle',
              }}
              rules={[{ required: true }]}
            />
            <ProFormText name="gitAddress" label="Git" rules={[{ required: true, max: 255 }]} />
            <ProFormTextArea name="description" label="项目描述" rules={[{ max: 255 }]} />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};

export default ProjectManagement;
