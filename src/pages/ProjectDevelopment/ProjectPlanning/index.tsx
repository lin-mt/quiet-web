import {
  addIteration,
  getIterationDetail,
  updateIteration,
} from '@/services/quiet/iterationController';
import { listCurrentUserProject } from '@/services/quiet/projectController';
import {
  addVersion,
  deleteVersion,
  getVersionDetail,
  treeVersionDetail,
  updateVersion,
} from '@/services/quiet/versionController';
import { IdName, PlanningStatus, planningStatusColor, planningStatusLabel } from '@/util/Utils';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormItem,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import {
  Button,
  Card,
  Cascader,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Form,
  List,
  Popconfirm,
  Row,
  Table,
  Tag,
  theme,
  Tooltip,
  Tree,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

type PlanningSelected = {
  versionId?: string;
  iterationId?: string;
};

type PlanningTreeNode = {
  key: string;
  title: string;
  versionId?: string;
  versionStatus?: string;
  iterationId?: string;
  iterationStatus?: string;
  children?: PlanningTreeNode[];
};

function buildPlanningTreeData(versions?: API.TreeVersionDetail[]): PlanningTreeNode[] | undefined {
  return versions?.map((version) => {
    const node: PlanningTreeNode = {
      key: version.id,
      title: version.name,
      versionId: version.id,
      versionStatus: version.status,
    };
    if (version.children) {
      node.children = buildPlanningTreeData(version.children);
    }
    if (version.iterations) {
      node.children = node.children || [];
      node.children.push(
        ...version.iterations.map((iteration) => {
          return {
            key: iteration.id,
            title: iteration.name,
            iterationId: iteration.id,
            iterationStatus: iteration.status,
          };
        }),
      );
    }
    return node;
  });
}

function formatPlannedRange(value: any) {
  if (value.plannedRange) {
    value.plannedStartTime = dayjs(value.plannedRange[0]).format('YYYY-MM-DD HH:mm');
    value.plannedEndTime = dayjs(value.plannedRange[1]).format('YYYY-MM-DD HH:mm');
  }
}

const ProjectPlanning: React.FC = () => {
  const { token } = theme.useToken();
  const [updateVersionForm] = Form.useForm();
  const [updateIterationForm] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState<React.Key[]>();
  const [selectedProject, setSelectedProject] = useState<string>();
  const [planningSelect, setPlanningSelect] = useState<PlanningSelected>();
  const [userProjects, setUserProjects] = useState<API.UserProject[]>([]);
  const [projectVersionDetail, setProjectVersionDetail] = useState<API.TreeVersionDetail[]>();
  const [planningTree, setPlanningTree] = useState<PlanningTreeNode[]>();
  const [versionDetail, setVersionDetail] = useState<API.VersionDetail>();
  const [iterationDetail, setIterationDetail] = useState<API.IterationDetail>();

  function updateVersionDetail() {
    if (planningSelect?.versionId) {
      getVersionDetail({ id: planningSelect.versionId }).then((resp) => setVersionDetail(resp));
    } else {
      setVersionDetail(undefined);
    }
    if (planningSelect?.iterationId) {
      getIterationDetail({ id: planningSelect.iterationId }).then((resp) =>
        setIterationDetail(resp),
      );
    } else {
      setIterationDetail(undefined);
    }
  }

  function updateTreeVersionDetail() {
    if (selectedProject) {
      treeVersionDetail({ projectId: selectedProject }).then((resp) =>
        setProjectVersionDetail(resp),
      );
    }
  }

  useEffect(() => {
    listCurrentUserProject().then((resp) => setUserProjects(resp));
  }, []);

  useEffect(() => {
    updateTreeVersionDetail();
  }, [selectedProject]);

  useEffect(() => {
    updateVersionDetail();
  }, [planningSelect]);

  useEffect(() => {
    setPlanningTree(buildPlanningTreeData(projectVersionDetail));
  }, [projectVersionDetail]);

  function getVersionPlanning(versionDetail: API.VersionDetail): any[] {
    const vplanning: any[] = [];
    versionDetail?.children?.forEach((v) => {
      vplanning.push({ isVersion: true, ...v });
    });

    versionDetail?.iterations?.forEach((v) => {
      vplanning.push({ isIteration: true, ...v });
    });

    return vplanning;
  }

  function updateSelectedkey(versionId: string | undefined, iterationId: string | undefined) {
    if (versionId) {
      setSelectedKey([versionId]);
    }
    if (iterationId) {
      setSelectedKey([iterationId]);
    }
    setPlanningSelect({ versionId, iterationId });
  }

  return (
    <PageContainer title={false}>
      <Card>
        规划项目：
        <Cascader
          placeholder="请选择项目"
          expandTrigger="hover"
          allowClear={false}
          style={{ width: 300 }}
          fieldNames={{ label: 'name', value: 'id', children: 'projects' }}
          options={userProjects}
          onChange={(val) => {
            setSelectedProject(val[val?.length - 1]);
          }}
        />
        <Divider style={{ marginTop: token.margin, marginBottom: token.margin }} />
        {selectedProject ? (
          <Row gutter={30}>
            <Col span={12}>
              <Flex justify={'space-between'} align={'center'} style={{ marginBottom: 10 }}>
                <Typography.Title level={5} style={{ margin: 0, fontWeight: 500 }}>
                  <Row gutter={7}>
                    <Col>项目规划</Col>
                    {Object.values(PlanningStatus).map((s) => (
                      <Col key={s}>
                        <Tag bordered={false} style={{ margin: 0 }} color={planningStatusColor(s)}>
                          {planningStatusLabel(s)}
                        </Tag>
                      </Col>
                    ))}
                  </Row>
                </Typography.Title>
                <Flex justify={'space-between'} align={'center'}>
                  <ModalForm
                    layout={'horizontal'}
                    labelCol={{ span: 3 }}
                    title={'新建版本'}
                    trigger={
                      <Button type="text" icon={<PlusOutlined />}>
                        新建版本
                      </Button>
                    }
                    submitter={{
                      render: (props, defaultDoms) => {
                        return [
                          <Button
                            key="extra-reset"
                            onClick={() => {
                              props.reset();
                            }}
                          >
                            重置
                          </Button>,
                          ...defaultDoms,
                        ];
                      },
                    }}
                    onFinish={async (value) => {
                      value.projectId = selectedProject;
                      if (value.plannedRange) {
                        value.plannedStartTime = dayjs(value.plannedRange[0]).format(
                          'YYYY-MM-DD HH:mm',
                        );
                        value.plannedEndTime = dayjs(value.plannedRange[1]).format(
                          'YYYY-MM-DD HH:mm',
                        );
                      }
                      await addVersion(value as API.AddVersion).then(async () => {
                        if (value.parentId === versionDetail?.id) {
                          updateVersionDetail();
                        }
                        const resp = await treeVersionDetail({ projectId: value.projectId });
                        return setProjectVersionDetail(resp);
                      });
                      return true;
                    }}
                  >
                    <ProFormText
                      name={'name'}
                      label={'版本名称'}
                      rules={[{ required: true }, { max: 30 }]}
                    />
                    <ProFormTreeSelect
                      allowClear
                      name="parentId"
                      label={'父版本'}
                      fieldProps={{
                        fieldNames: IdName,
                        treeData: projectVersionDetail,
                      }}
                    />
                    <ProFormItem name={'plannedRange'} label="计划时间">
                      <DatePicker.RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['计划开始时间', '计划结束时间']}
                      />
                    </ProFormItem>
                    <ProFormTextArea
                      name={'description'}
                      label={'版本描述'}
                      rules={[{ max: 255 }]}
                    />
                  </ModalForm>

                  <ModalForm
                    title={'新建迭代'}
                    layout={'horizontal'}
                    labelCol={{ span: 3 }}
                    trigger={
                      <Button type="text" icon={<PlusOutlined />}>
                        新建迭代
                      </Button>
                    }
                    submitter={{
                      render: (props, defaultDoms) => {
                        return [
                          <Button
                            key="extra-reset"
                            onClick={() => {
                              props.reset();
                            }}
                          >
                            重置
                          </Button>,
                          ...defaultDoms,
                        ];
                      },
                    }}
                    onFinish={async (value) => {
                      if (value.plannedRange) {
                        value.plannedStartTime = dayjs(value.plannedRange[0]).format(
                          'YYYY-MM-DD HH:mm',
                        );
                        value.plannedEndTime = dayjs(value.plannedRange[1]).format(
                          'YYYY-MM-DD HH:mm',
                        );
                      }
                      await addIteration(value as API.AddIteration).then(async () => {
                        updateTreeVersionDetail();
                        updateVersionDetail();
                      });
                      return true;
                    }}
                  >
                    <ProFormText
                      name={'name'}
                      label={'迭代名称'}
                      rules={[{ required: true }, { max: 30 }]}
                    />
                    <ProFormTreeSelect
                      allowClear
                      name="versionId"
                      label={'所属版本'}
                      request={() => treeVersionDetail({ projectId: selectedProject || '' })}
                      fieldProps={{
                        fieldNames: IdName,
                      }}
                    />
                    <ProFormItem name={'plannedRange'} label="计划时间">
                      <DatePicker.RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['计划开始时间', '计划结束时间']}
                      />
                    </ProFormItem>
                    <ProFormTextArea
                      name={'description'}
                      label={'迭代描述'}
                      rules={[{ max: 255 }]}
                    />
                  </ModalForm>
                </Flex>
              </Flex>
              <Tree<PlanningTreeNode>
                blockNode
                selectedKeys={selectedKey}
                titleRender={(node) => (
                  <>
                    <Tag
                      bordered={false}
                      color={
                        planningStatusColor(node.versionStatus) ||
                        planningStatusColor(node.iterationStatus)
                      }
                    >
                      {node.versionId && '版本'}
                      {node.iterationId && '迭代'}
                    </Tag>
                    {node.title}
                  </>
                )}
                treeData={planningTree}
                onSelect={(_, { node }) => {
                  updateSelectedkey(node.versionId, node.iterationId);
                }}
              />
            </Col>
            <Col span={12}>
              {versionDetail && (
                <>
                  <Flex justify={'space-between'} align={'center'} style={{ marginBottom: 10 }}>
                    <Typography.Title level={5} style={{ margin: 0, fontWeight: 500 }}>
                      版本信息
                    </Typography.Title>
                    <div>
                      <ModalForm
                        title={'编辑版本'}
                        layout={'horizontal'}
                        labelCol={{ span: 3 }}
                        form={updateVersionForm}
                        trigger={
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => updateVersionForm.setFieldsValue(versionDetail)}
                          >
                            编辑版本
                          </Button>
                        }
                        submitter={{
                          render: (props, defaultDoms) => {
                            return [
                              <Button
                                key="extra-reset"
                                onClick={() => {
                                  props.reset();
                                }}
                              >
                                重置
                              </Button>,
                              ...defaultDoms,
                            ];
                          },
                        }}
                        onFinish={async (value) => {
                          if (value.plannedRange) {
                            value.plannedStartTime = dayjs(value.plannedRange[0]).format(
                              'YYYY-MM-DD HH:mm',
                            );
                            value.plannedEndTime = dayjs(value.plannedRange[1]).format(
                              'YYYY-MM-DD HH:mm',
                            );
                          }
                          const newVersion = { ...versionDetail, ...value };
                          await updateVersion(newVersion).then(async () => {
                            setVersionDetail(newVersion);
                            const resp = await treeVersionDetail({
                              projectId: versionDetail.projectId,
                            });
                            return setProjectVersionDetail(resp);
                          });
                          return true;
                        }}
                      >
                        <ProFormText
                          name={'name'}
                          label={'版本名称'}
                          rules={[{ required: true }, { max: 30 }]}
                        />
                        <ProFormTreeSelect
                          allowClear
                          name="parentId"
                          label={'父版本'}
                          fieldProps={{
                            fieldNames: IdName,
                            treeData: projectVersionDetail,
                          }}
                        />
                        <ProFormItem name={'plannedRange'} label="计划时间">
                          <DatePicker.RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['计划开始时间', '计划结束时间']}
                          />
                        </ProFormItem>
                        <ProFormTextArea
                          name={'description'}
                          label={'版本描述'}
                          rules={[{ max: 255 }]}
                        />
                      </ModalForm>
                      <Popconfirm
                        title="确认删除该版本吗?"
                        onConfirm={() => {
                          deleteVersion({ id: versionDetail.id }).then(async () => {
                            setPlanningSelect(undefined);
                            const resp = await treeVersionDetail({
                              projectId: versionDetail.projectId,
                            });
                            setProjectVersionDetail(resp);
                            if (versionDetail.parentId) {
                              updateSelectedkey(versionDetail.parentId, undefined);
                            }
                          });
                        }}
                      >
                        <Button type="text" danger icon={<DeleteOutlined />}>
                          删除
                        </Button>
                      </Popconfirm>
                    </div>
                  </Flex>
                  <Descriptions
                    bordered
                    column={2}
                    size="small"
                    items={[
                      { label: '版本名称', children: versionDetail.name, span: 2 },
                      { label: '版本ID', children: versionDetail.id },
                      {
                        label: '版本状态',
                        children: (
                          <Tag color={planningStatusColor(versionDetail.status)}>
                            {planningStatusLabel(versionDetail.status)}
                          </Tag>
                        ),
                      },
                      { label: '计划开始时间', children: versionDetail.plannedStartTime },
                      { label: '计划结束时间', children: versionDetail.plannedEndTime },
                      { label: '描述', children: versionDetail.description, span: 2 },
                    ]}
                  />
                  <Table
                    bordered
                    size={'small'}
                    columns={[
                      {
                        title: '名称',
                        dataIndex: 'name',
                        render: (_, record) => {
                          return (
                            <Button
                              size="small"
                              type={'link'}
                              onClick={() => {
                                if (record.isVersion) {
                                  updateSelectedkey(record.id, undefined);
                                } else {
                                  updateSelectedkey(undefined, record.id);
                                }
                              }}
                            >
                              {record.name}
                            </Button>
                          );
                        },
                      },
                      {
                        title: '类型/状态',
                        dataIndex: 'status',
                        render: (_, record) => {
                          return (
                            <Tag bordered={false} color={planningStatusColor(record.status)}>
                              {record.isVersion && '版本'}
                              {record.isIteration && '迭代'}
                            </Tag>
                          );
                        },
                      },
                      {
                        title: (
                          <>
                            需求&nbsp;
                            <Tooltip title={'总数/未开始/进行中/已完成'}>
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </>
                        ),
                        render: () => {
                          return '--/--/--/--';
                        },
                      },
                      {
                        title: (
                          <>
                            任务&nbsp;
                            <Tooltip title={'总数/未开始/进行中/已完成'}>
                              <QuestionCircleOutlined />
                            </Tooltip>
                          </>
                        ),
                        render: () => {
                          return '--/--/--/--';
                        },
                      },
                    ]}
                    rowKey={'id'}
                    pagination={false}
                    style={{ marginTop: 15 }}
                    dataSource={getVersionPlanning(versionDetail)}
                  />
                </>
              )}
              {iterationDetail && (
                <>
                  <Flex justify={'space-between'} align={'center'} style={{ marginBottom: 10 }}>
                    <Typography.Title level={5} style={{ margin: 0, fontWeight: 500 }}>
                      迭代信息
                    </Typography.Title>
                    <div>
                      <ModalForm
                        title={'编辑迭代'}
                        layout={'horizontal'}
                        labelCol={{ span: 3 }}
                        form={updateIterationForm}
                        trigger={
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => updateIterationForm.setFieldsValue(iterationDetail)}
                          >
                            编辑迭代
                          </Button>
                        }
                        submitter={{
                          render: (props, defaultDoms) => {
                            return [
                              <Button
                                key="extra-reset"
                                onClick={() => {
                                  props.reset();
                                }}
                              >
                                重置
                              </Button>,
                              ...defaultDoms,
                            ];
                          },
                        }}
                        onFinish={async (value) => {
                          formatPlannedRange(value);
                          const newIteration = { ...iterationDetail, ...value };
                          await updateIteration(newIteration).then(() => {
                            setIterationDetail(newIteration);
                            updateTreeVersionDetail();
                          });
                          return true;
                        }}
                      >
                        <ProFormText
                          name={'name'}
                          label={'版本名称'}
                          rules={[{ required: true }, { max: 30 }]}
                        />
                        <ProFormTreeSelect
                          allowClear
                          name="versionId"
                          label={'所属版本'}
                          request={() => treeVersionDetail({ projectId: selectedProject })}
                          fieldProps={{
                            fieldNames: IdName,
                          }}
                        />
                        <ProFormItem name={'plannedRange'} label="计划时间">
                          <DatePicker.RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['计划开始时间', '计划结束时间']}
                          />
                        </ProFormItem>
                        <ProFormTextArea
                          name={'description'}
                          label={'版本描述'}
                          rules={[{ max: 255 }]}
                        />
                      </ModalForm>
                      <Popconfirm
                        title="确认删除该迭代吗?"
                        onConfirm={() => {
                          deleteVersion({ id: iterationDetail.id }).then(async () => {
                            updateSelectedkey(iterationDetail.versionId, undefined);
                            updateTreeVersionDetail();
                          });
                        }}
                      >
                        <Button type="text" danger icon={<DeleteOutlined />}>
                          删除
                        </Button>
                      </Popconfirm>
                    </div>
                  </Flex>
                  <Descriptions
                    bordered
                    column={2}
                    size="small"
                    items={[
                      { label: '迭代名称', children: iterationDetail.name, span: 2 },
                      { label: '迭代ID', children: iterationDetail.id },
                      {
                        label: '迭代状态',
                        children: (
                          <Tag color={planningStatusColor(iterationDetail.status)}>
                            {planningStatusLabel(iterationDetail.status)}
                          </Tag>
                        ),
                      },
                      { label: '计划开始时间', children: iterationDetail.plannedStartTime },
                      { label: '计划结束时间', children: iterationDetail.plannedEndTime },
                      { label: '描述', children: iterationDetail.description, span: 2 },
                    ]}
                  />
                  <List bordered style={{ marginTop: 15 }} />
                </>
              )}
            </Col>
          </Row>
        ) : (
          <Empty description={'请选择要规划的项目'} />
        )}
      </Card>
    </PageContainer>
  );
};

export default ProjectPlanning;
