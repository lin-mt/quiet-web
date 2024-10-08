import {
  addProject,
  deleteProject,
  getProjectDetail,
  pageProject,
  updateProject,
} from '@/services/quiet/projectController';
import {
  listCurrentUserProjectGroup,
  listProjectGroupUser,
} from '@/services/quiet/projectGroupController';
import { listRepository } from '@/services/quiet/repositoryController';
import { listTemplate } from '@/services/quiet/templateController';
import { IdName, IdUsername } from '@/util/Utils';
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
import { Button, Checkbox, Col, Form, Popconfirm, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const ProjectManagement: React.FC = () => {
  const ref = useRef<ActionType>();
  const [form] = Form.useForm<API.AddProject>();
  const [editForm] = Form.useForm<API.UpdateProject>();
  const [templates, setTemplates] = useState<API.TemplateVO[]>();
  const [repositories, setRepositories] = useState<API.RepositoryVO[]>();
  const [projectGroups, setProjectGroups] = useState<API.ProjectGroupVO[]>();
  const [projectMembers, setProjectMembers] = useState<API.SimpleUser[]>();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    description: {
      show: false,
    },
    option: { fixed: 'right', disable: true },
  });

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
            message: '长度不能超过 30',
          },
        ],
      },
    },
    {
      title: '项目组',
      valueType: 'select',
      dataIndex: 'projectGroupId',
      request: () =>
        listCurrentUserProjectGroup().then((resp) =>
          resp.map((g) => {
            return { value: g.id, label: g.name };
          }),
        ),
    },
    {
      title: '模板',
      valueType: 'select',
      dataIndex: 'templateId',
      request: () =>
        listTemplate({}).then((resp) =>
          resp.map((t) => {
            return { value: t.id, label: t.name };
          }),
        ),
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
      render: (_text, record) => [
        <ModalForm<API.UpdateProject>
          form={editForm}
          key={'edit'}
          title={'编辑项目'}
          layout={'horizontal'}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          trigger={
            <a
              type="primary"
              onClick={() =>
                getProjectDetail({ id: record.id }).then((resp) => {
                  listProjectGroupUser({
                    projectGroupId: record.projectGroupId,
                    username: '',
                  }).then((resp) => setProjectMembers(resp));
                  editForm.setFieldsValue(resp);
                })
              }
            >
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
            updateProject(formData).then(() => {
              editForm.resetFields();
              ref.current?.reload();
              return true;
            })
          }
        >
          <ProFormText name="id" label="项目ID" readonly />
          <ProFormText name="name" label="项目名称" rules={[{ required: true, max: 30 }]} />
          <ProFormSelect
            name="projectGroupId"
            label="项目组"
            options={projectGroups}
            fieldProps={{ fieldNames: IdName }}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            label="模板"
            name="templateId"
            options={templates}
            fieldProps={{ fieldNames: IdName }}
            rules={[{ required: true }]}
          />
          <ProFormSelect
            mode="multiple"
            name="repositoryIds"
            label={'代码仓库'}
            options={repositories}
            fieldProps={{ fieldNames: IdName }}
            onChange={(_, option) => {
              const options: API.RepositoryVO[] = Array.isArray(option) ? option : [option];
              const ids: string[] = options.map((r) => r.id);
              const selected: API.ProjectRepositoryDTO[] = editForm.getFieldValue('repositories');
              const filteredSelected =
                selected?.filter((repo) => ids.includes(repo.repositoryId)) || [];
              const missingInSelected: API.ProjectRepositoryDTO[] = options
                .filter((option) => !selected?.some((repo) => repo.repositoryId === option.id))
                .map((option) => ({
                  repositoryId: option.id,
                  autoCreateBranch: false,
                  autoCreatePullRequest: false,
                }));
              const updatedSelected = [...filteredSelected, ...missingInSelected];
              editForm.setFieldValue('repositories', updatedSelected);
            }}
          />
          <Form.List name="repositories">
            {(fields) => {
              return (
                <>
                  {fields.map(({ name, key }) => {
                    const fieldValue = editForm.getFieldValue('repositories')[name];
                    return (
                      <Row key={key} style={{ marginBottom: 24 }}>
                        <Col span={6} offset={4}>
                          <Form.Item noStyle>
                            {
                              repositories?.find((repo) => repo.id === fieldValue.repositoryId)
                                ?.name
                            }
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          自动创建分支：
                          <Form.Item
                            noStyle
                            name={[name, 'autoCreateBranch']}
                            valuePropName={'checked'}
                          >
                            <Checkbox />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          自动创建 PR：
                          <Form.Item
                            noStyle
                            name={[name, 'autoCreatePullRequest']}
                            valuePropName={'checked'}
                          >
                            <Checkbox />
                          </Form.Item>
                        </Col>
                      </Row>
                    );
                  })}
                </>
              );
            }}
          </Form.List>
          <ProFormSelect
            label="项目成员"
            mode="multiple"
            name={'memberIds'}
            options={projectMembers}
            fieldProps={{ fieldNames: IdUsername }}
          />
          <ProFormTextArea name="description" label="项目描述" rules={[{ max: 255 }]} />
        </ModalForm>,
        <Popconfirm
          key={'delete'}
          title="删除项目"
          style={{ width: '100vw' }}
          onConfirm={() => {
            deleteProject({ id: record.id }).then(() => ref.current?.reload());
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  useEffect(() => {
    listTemplate({}).then((resp) => setTemplates(resp));
    listRepository({}).then((resp) => setRepositories(resp));
    listCurrentUserProjectGroup().then((resp) => setProjectGroups(resp));
  }, []);

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
          deleteText: <span style={{ color: 'red' }}>删除</span>,
          onSave: (_, record) =>
            updateProject(record).then(() => {
              ref.current?.reload();
            }),
          onDelete: (_, record) =>
            deleteProject({ id: record.id }).then(() => {
              ref.current?.reload();
            }),
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: setColumnsStateMap,
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
              name="projectGroupId"
              label="项目组"
              options={projectGroups}
              fieldProps={{ fieldNames: IdName }}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="templateId"
              label="模板"
              options={templates}
              fieldProps={{ fieldNames: IdName }}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              mode="multiple"
              label={'代码仓库'}
              name="repositoryIds"
              options={repositories}
              fieldProps={{ fieldNames: IdName }}
              onChange={(_, option) => {
                const options: API.RepositoryVO[] = Array.isArray(option) ? option : [option];
                const ids: string[] = options.map((r) => r.id);
                const selected: API.ProjectRepositoryDTO[] = form.getFieldValue('repositories');
                console.log(selected);
                const filteredSelected =
                  selected?.filter((repo) => ids.includes(repo.repositoryId)) || [];
                const missingInSelected: API.ProjectRepositoryDTO[] = options
                  .filter((option) => !selected?.some((repo) => repo.repositoryId === option.id))
                  .map((option) => ({
                    repositoryId: option.id,
                    autoCreateBranch: false,
                    autoCreatePullRequest: false,
                  }));
                const updatedSelected = [...filteredSelected, ...missingInSelected];
                form.setFieldValue('repositories', updatedSelected);
              }}
            />
            <Form.List name="repositories">
              {(fields) => {
                return (
                  <>
                    {fields.map(({ name, key }) => {
                      const fieldValue = form.getFieldValue('repositories')[name];
                      return (
                        <Row key={key} style={{ marginBottom: 24 }}>
                          <Col span={6} offset={4}>
                            <Form.Item noStyle>
                              {
                                repositories?.find((repo) => repo.id === fieldValue.repositoryId)
                                  ?.name
                              }
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            自动创建分支：
                            <Form.Item
                              noStyle
                              name={[name, 'autoCreateBranch']}
                              valuePropName={'checked'}
                            >
                              <Checkbox />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            自动创建 PR：
                            <Form.Item
                              noStyle
                              name={[name, 'autoCreatePullRequest']}
                              valuePropName={'checked'}
                            >
                              <Checkbox />
                            </Form.Item>
                          </Col>
                        </Row>
                      );
                    })}
                  </>
                );
              }}
            </Form.List>
            <ProFormSelect
              label="项目成员"
              mode="multiple"
              name={'memberIds'}
              options={projectMembers}
              fieldProps={{ fieldNames: IdUsername }}
            />
            <ProFormTextArea name="description" label="项目描述" rules={[{ max: 255 }]} />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};

export default ProjectManagement;
