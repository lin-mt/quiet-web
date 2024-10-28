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
import { getTemplateDetail, listTemplate } from '@/services/quiet/templateController';
import {
  AutomationAction,
  IdName,
  IdUsername,
  RequirementStatus,
  toLabelValue,
  TriggerAction,
} from '@/util/Utils';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ColumnsState,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Col, Form, Popconfirm, Row, theme, Tooltip } from 'antd';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

function showRequirementType(
  triggerAction:
    | 'START_ITERATION'
    | 'END_ITERATION'
    | 'CREATE_REQUIREMENT'
    | 'UPDATE_REQUIREMENT'
    | 'UPDATE_REQUIREMENT_STATUS'
    | 'DELETE_REQUIREMENT'
    | 'CREATE_TASK'
    | 'UPDATE_TASK'
    | 'UPDATE_TASK_STEP'
    | 'DELETE_TASK'
    | undefined,
): boolean {
  return (
    triggerAction === 'CREATE_REQUIREMENT' ||
    triggerAction === 'UPDATE_REQUIREMENT' ||
    triggerAction === 'UPDATE_REQUIREMENT_STATUS' ||
    triggerAction === 'DELETE_REQUIREMENT'
  );
}

function showTaskType(
  triggerAction:
    | 'START_ITERATION'
    | 'END_ITERATION'
    | 'CREATE_REQUIREMENT'
    | 'UPDATE_REQUIREMENT'
    | 'UPDATE_REQUIREMENT_STATUS'
    | 'DELETE_REQUIREMENT'
    | 'CREATE_TASK'
    | 'UPDATE_TASK'
    | 'UPDATE_TASK_STEP'
    | 'DELETE_TASK'
    | undefined,
) {
  return (
    triggerAction === 'CREATE_TASK' ||
    triggerAction === 'UPDATE_TASK' ||
    triggerAction === 'UPDATE_TASK_STEP' ||
    triggerAction === 'DELETE_TASK'
  );
}

function showPreAfterRequirementStatus(
  triggerAction:
    | 'START_ITERATION'
    | 'END_ITERATION'
    | 'CREATE_REQUIREMENT'
    | 'UPDATE_REQUIREMENT'
    | 'UPDATE_REQUIREMENT_STATUS'
    | 'DELETE_REQUIREMENT'
    | 'CREATE_TASK'
    | 'UPDATE_TASK'
    | 'UPDATE_TASK_STEP'
    | 'DELETE_TASK'
    | undefined,
) {
  return triggerAction === 'UPDATE_REQUIREMENT_STATUS';
}

function showTaskStep(
  triggerAction:
    | 'START_ITERATION'
    | 'END_ITERATION'
    | 'CREATE_REQUIREMENT'
    | 'UPDATE_REQUIREMENT'
    | 'UPDATE_REQUIREMENT_STATUS'
    | 'DELETE_REQUIREMENT'
    | 'CREATE_TASK'
    | 'UPDATE_TASK'
    | 'UPDATE_TASK_STEP'
    | 'DELETE_TASK'
    | undefined,
) {
  return triggerAction === 'UPDATE_TASK_STEP';
}

function showRepository(
  automationAction:
    | 'CREATE_BRANCH'
    | 'DELETE_BRANCH'
    | 'CREATE_PR'
    | 'CLOSE_PR'
    | 'DELETE_PR'
    | 'CREATE_ISSUE'
    | 'CLOSE_ISSUE'
    | 'DELETE_ISSUE'
    | 'SEND_EMAIL'
    | 'FEI_SHU_NOTIFY'
    | 'DING_DING_NOTIFY'
    | 'WORK_WEI_XIN_NOTIFY'
    | 'INTERNAL_MESSAGE'
    | undefined,
): boolean {
  switch (automationAction) {
    case 'CREATE_BRANCH':
    case 'DELETE_BRANCH':
    case 'CREATE_PR':
    case 'CLOSE_PR':
    case 'DELETE_PR':
    case 'CREATE_ISSUE':
    case 'CLOSE_ISSUE':
    case 'DELETE_ISSUE':
      return true;
    default:
      return false;
  }
}

type ProjectModalProp<T> = {
  projectId?: string;
  title: string;
  trigger: React.JSX.Element;
  onFinish: ((formData: T) => void | Promise<boolean | void>) & ((formData: T) => Promise<any>);
};

const ProjectManagement: React.FC = () => {
  const { token } = theme.useToken();
  const ref = useRef<ActionType>();
  const [templates, setTemplates] = useState<API.TemplateVO[]>();
  const [repositories, setRepositories] = useState<API.RepositoryVO[]>();
  const [projectGroups, setProjectGroups] = useState<API.ProjectGroupVO[]>();
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    description: {
      show: false,
    },
    option: { fixed: 'right', disable: true },
  });

  useEffect(() => {
    listTemplate({}).then((resp) => setTemplates(resp));
    listRepository({}).then((resp) => setRepositories(resp));
    listCurrentUserProjectGroup().then((resp) => setProjectGroups(resp));
  }, []);

  const automationTitleStyle: CSSProperties = {
    height: 32,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    justifyContent: 'center',
    backgroundColor: 'rgb(235, 236, 240)',
    borderRadius: token.borderRadius,
  };

  function ProjectModal<T extends API.AddProject>(props: ProjectModalProp<T>) {
    const { projectId, title, trigger, onFinish } = props;
    const [form] = Form.useForm();

    const [selectedTemplate, setSelectedTemplate] = useState<API.TemplateDetail>();
    const [projectMembers, setProjectMembers] = useState<API.SimpleUser[]>();
    const [initialValues, setInitialValues] = useState<API.ProjectDetail>();

    useEffect(() => {
      if (!projectId) {
        return;
      }
      getProjectDetail({ id: projectId }).then((resp) => {
        listProjectGroupUser({
          projectGroupId: resp.projectGroupId,
          username: '',
        }).then((resp) => setProjectMembers(resp));
        getTemplateDetail({ id: resp.templateId }).then((resp) => {
          setSelectedTemplate(resp);
        });
        setInitialValues(resp);
      });
    }, [projectId]);

    return (
      <ModalForm<T>
        form={form}
        width={1100}
        title={title}
        layout={'horizontal'}
        initialValues={initialValues}
        labelCol={{ flex: '93px' }}
        onValuesChange={(changedValues, values) => {
          if (changedValues.projectGroupId) {
            listProjectGroupUser({
              projectGroupId: changedValues.projectGroupId,
              username: '',
            }).then((resp) => setProjectMembers(resp));
          } else if (!values.projectGroupId) {
            setProjectMembers([]);
          }
          if (changedValues.templateId) {
            getTemplateDetail({ id: changedValues.templateId }).then((resp) => {
              const automations: API.ProjectAutomationDTO[] = form.getFieldValue('automations');
              if (!automations || automations.length === 0) {
                return;
              }
              const projectAutomations = automations.filter(
                (automation) =>
                  !automation ||
                  automation.triggerAction === 'START_ITERATION' ||
                  automation.triggerAction === 'END_ITERATION',
              );
              form.setFieldValue('automations', projectAutomations);
              setSelectedTemplate(resp);
            });
          }
        }}
        trigger={trigger}
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
        onFinish={onFinish}
      >
        <Row>
          <Col span={12}>
            <ProFormText
              allowClear={false}
              name="name"
              label="项目名称"
              rules={[{ required: true, max: 30 }]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              label="项目组"
              allowClear={false}
              name="projectGroupId"
              options={projectGroups}
              rules={[{ required: true }]}
              fieldProps={{ fieldNames: IdName }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProFormSelect
              label="项目模板"
              name="templateId"
              allowClear={false}
              options={templates}
              rules={[{ required: true }]}
              fieldProps={{ fieldNames: IdName }}
            />
          </Col>
          <Col span={12}>
            <ProFormDependency name={['projectGroupId']}>
              {({ projectGroupId }) => {
                return (
                  <ProFormSelect
                    label="项目成员"
                    mode="multiple"
                    name={'memberIds'}
                    placeholder={projectGroupId ? '请选择项目成员' : '请选择项目组'}
                    options={projectMembers}
                    rules={[{ required: true }]}
                    fieldProps={{
                      fieldNames: IdUsername,
                      maxTagCount: 'responsive',
                    }}
                  />
                );
              }}
            </ProFormDependency>
          </Col>
        </Row>
        <ProFormTextArea name="description" label="项目描述" rules={[{ max: 255 }]} />
        <Form.Item noStyle>
          <Form.List name="automations">
            {(fields, { add, remove }) => (
              <>
                <Row gutter={6} style={{ marginBottom: 13 }}>
                  <Col flex={'auto'}>
                    <Row gutter={4} justify="space-around" align="middle">
                      <Col span={4}>
                        <span style={automationTitleStyle}>触发动作</span>
                      </Col>
                      <Col span={6}>
                        <span style={automationTitleStyle}>需求/任务类型</span>
                      </Col>
                      <Col span={7}>
                        <span style={automationTitleStyle}>状态变更</span>
                      </Col>
                      <Col span={7}>
                        <span style={automationTitleStyle}>自动化</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col flex={'0 0 36px'}>
                    <Tooltip title={'添加自动化'}>
                      <Button onClick={() => add()} icon={<PlusOutlined />} />
                    </Tooltip>
                  </Col>
                </Row>
                {fields.map(({ key, name }) => (
                  <Form.Item noStyle key={key}>
                    <Row gutter={6}>
                      <Col flex={'auto'}>
                        <Row gutter={4}>
                          <Col span={4}>
                            <ProFormDependency name={['templateId']}>
                              {({ templateId }) => {
                                // noinspection JSUnusedGlobalSymbols
                                return (
                                  <>
                                    <ProFormSelect
                                      allowClear={false}
                                      placeholder="触发动作"
                                      name={[name, 'triggerAction']}
                                      rules={[{ required: true }]}
                                      options={toLabelValue(TriggerAction, (action) => {
                                        return (
                                          action !== 'START_ITERATION' &&
                                          'END_ITERATION' !== action &&
                                          !templateId
                                        );
                                      })}
                                      fieldProps={{
                                        optionRender: (option) => {
                                          const op: any = option;
                                          return (
                                            <Tooltip
                                              title={op.data.disabled ? '请选择项目模板' : ''}
                                            >
                                              {option.label}
                                            </Tooltip>
                                          );
                                        },
                                      }}
                                    />
                                  </>
                                );
                              }}
                            </ProFormDependency>
                          </Col>
                          <ProFormDependency name={['automations']}>
                            {({ automations }) => {
                              const triggerAction = automations[name]?.triggerAction;
                              return (
                                <>
                                  <Col span={6}>
                                    {showRequirementType(triggerAction) && (
                                      <ProFormSelect
                                        placeholder="需求类型"
                                        rules={[{ required: true }]}
                                        name={[name, 'requirementTypeIds']}
                                        options={selectedTemplate?.requirementTypes}
                                        fieldProps={{
                                          fieldNames: IdName,
                                          mode: 'multiple',
                                          maxTagCount: 'responsive',
                                        }}
                                      />
                                    )}
                                    {showTaskType(triggerAction) && (
                                      <ProFormSelect
                                        placeholder="任务类型"
                                        rules={[{ required: true }]}
                                        name={[name, 'taskTypeIds']}
                                        options={selectedTemplate?.taskTypes}
                                        fieldProps={{
                                          fieldNames: IdName,
                                          mode: 'multiple',
                                          maxTagCount: 'responsive',
                                        }}
                                      />
                                    )}
                                  </Col>
                                  <Col span={7}>
                                    <Row gutter={3}>
                                      {showPreAfterRequirementStatus(triggerAction) && (
                                        <>
                                          <Col span={12}>
                                            <ProFormSelect
                                              allowClear={false}
                                              rules={[{ required: true }]}
                                              placeholder="前置状态"
                                              name={[name, 'preRequirementStatus']}
                                              options={toLabelValue(RequirementStatus)}
                                            />
                                          </Col>
                                          <Col span={12}>
                                            <ProFormSelect
                                              allowClear={false}
                                              rules={[{ required: true }]}
                                              placeholder="后置状态"
                                              name={[name, 'afterRequirementStatus']}
                                              options={toLabelValue(RequirementStatus)}
                                            />
                                          </Col>
                                        </>
                                      )}
                                      {showTaskStep(triggerAction) && (
                                        <>
                                          <Col span={12}>
                                            <ProFormSelect
                                              allowClear={false}
                                              rules={[{ required: true }]}
                                              placeholder="后置步骤"
                                              name={[name, 'afterTaskStepId']}
                                              options={selectedTemplate?.taskSteps}
                                              fieldProps={{ fieldNames: IdName }}
                                            />
                                          </Col>
                                          <Col span={12}>
                                            <ProFormSelect
                                              allowClear={false}
                                              rules={[{ required: true }]}
                                              placeholder="前置步骤"
                                              name={[name, 'preTaskStepId']}
                                              options={selectedTemplate?.taskSteps}
                                              fieldProps={{ fieldNames: IdName }}
                                            />
                                          </Col>
                                        </>
                                      )}
                                    </Row>
                                  </Col>
                                </>
                              );
                            }}
                          </ProFormDependency>
                          <Col span={7}>
                            <Row gutter={3}>
                              <ProFormDependency name={['automations']}>
                                {({ automations }) => {
                                  const automationAction = automations[name]?.automationAction;
                                  return (
                                    <>
                                      <Col span={showRepository(automationAction) ? 12 : 24}>
                                        <ProFormSelect
                                          allowClear={false}
                                          placeholder={'自动化'}
                                          rules={[{ required: true }]}
                                          name={[name, 'automationAction']}
                                          options={toLabelValue(AutomationAction)}
                                          onChange={(val: any) => {
                                            if (!showRepository(val)) {
                                              form.setFieldValue(
                                                ['automations', name, 'repositoryIds'],
                                                undefined,
                                              );
                                            }
                                          }}
                                        />
                                      </Col>
                                      {showRepository(automationAction) && (
                                        <Col span={12}>
                                          <ProFormSelect
                                            allowClear={false}
                                            placeholder="代码仓库"
                                            options={repositories}
                                            rules={[{ required: true }]}
                                            name={[name, 'repositoryIds']}
                                            fieldProps={{
                                              fieldNames: IdName,
                                              mode: 'multiple',
                                              maxTagCount: 'responsive',
                                            }}
                                          />
                                        </Col>
                                      )}
                                    </>
                                  );
                                }}
                              </ProFormDependency>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col flex={'0 0 36px'}>
                        <Button danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  </Form.Item>
                ))}
              </>
            )}
          </Form.List>
        </Form.Item>
      </ModalForm>
    );
  }

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
        <ProjectModal<API.UpdateProject>
          key={'addProject'}
          projectId={record.id}
          title={`编辑项目（ID：${record.id}）`}
          trigger={<a type="primary">编辑</a>}
          onFinish={(formData) =>
            updateProject({ ...record, ...formData }).then(() => {
              ref.current?.reload();
              return true;
            })
          }
        />,
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
          <ProjectModal<API.AddProject>
            key="addProject"
            title={'添加项目'}
            trigger={
              <Button key={'add'} icon={<PlusOutlined />} type={'primary'}>
                添加项目
              </Button>
            }
            onFinish={(formData) =>
              addProject(formData).then(() => {
                ref.current?.reload();
                return true;
              })
            }
          />,
        ]}
      />
    </PageContainer>
  );
};

export default ProjectManagement;
