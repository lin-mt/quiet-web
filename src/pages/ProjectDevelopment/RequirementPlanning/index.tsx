import RequirementCard from '@/components/RequirementCard';
import { getIterationDetail } from '@/services/quiet/iterationController';
import { getProjectDetail, listCurrentUserProject } from '@/services/quiet/projectController';
import { listCurrentUserProjectGroup } from '@/services/quiet/projectGroupController';
import {
  addRequirement,
  listRequirement,
  listRequirementByIterationId,
  planningRequirement,
} from '@/services/quiet/requirementController';
import { getTemplateDetail } from '@/services/quiet/templateController';
import { treeVersionDetail } from '@/services/quiet/versionController';
import { IdName, IdUsername, planningStatusColor, planningStatusLabel } from '@/util/Utils';
import { PlusOutlined, SendOutlined } from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';
import { useModel } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  List,
  Row,
  Select,
  Tag,
  TreeSelect,
  message,
  theme,
} from 'antd';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

type PlanningIteration = {
  projectGroupId?: string;
  projectId?: string;
  versionId?: string;
  iterationId?: string;
};

type PlanningTreeNode = {
  value: string;
  title: string;
  disabled?: boolean;
  versionId?: string;
  versionStatus?: string;
  iterationId?: string;
  iterationStatus?: string;
  children?: PlanningTreeNode[];
};

function buildPlanningTreeData(versions?: API.TreeVersionDetail[]): PlanningTreeNode[] | undefined {
  return versions?.map((version) => {
    const node: PlanningTreeNode = {
      value: version.id,
      title: version.name,
      disabled: true,
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
            value: iteration.id,
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

const DroppableId = {
  IterationPlanning: 'IterationPlanning',
  RequirementPool: 'RequirementPool',
};

const IdPrefix = {
  IterationPlanning: 'ip_',
  RequirementPool: 'rp_',
};

const RequirementPlanning: React.FC = () => {
  const { token } = theme.useToken();
  const [addForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { initialState } = useModel('@@initialState');
  const [projectGroups, setProjectGroups] = useState<API.SimpleProjectGroup[]>();
  const [searchParam, setSearchParam] = useState<API.ListRequirement>();
  const [requirements, setRequirements] = useState<API.RequirementVO[]>([]);
  const [iterationRequirements, setIterationRequirements] = useState<API.RequirementVO[]>([]);
  const [projects, setProjects] = useState<API.SimpleProject[]>();
  const [planningTree, setPlanningTree] = useState<PlanningTreeNode[]>();
  const [projectDetail, setProjectDetail] = useState<API.ProjectDetail>();
  const [templateDetail, setTemplateDetail] = useState<API.TemplateDetail>();
  const [selectedIteration, setSelectedIteration] = useState<PlanningIteration>();
  const preSelectedIterationRef = useRef<PlanningIteration>();
  const [planningIteration, setPlanningIteration] = useState<API.IterationDetail>();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const offset = '0';
  const limit = '20';
  const containerStyle: CSSProperties = { height: 600, overflow: 'auto' };

  function updateRequirements() {
    if (!searchParam?.projectId) {
      setRequirements([]);
      return;
    }
    if (!hasMore && searchParam.offset !== '0') {
      return;
    }
    const param = { ...searchParam };
    param.status = 'TO_BE_PLANNED';
    listRequirement({
      listRequirement: param,
    }).then((resp) => {
      if (resp) {
        setHasMore(resp.length !== 0 && resp.length >= Number(limit));
        if (param.offset === offset) {
          setRequirements(resp);
        } else {
          setRequirements([...requirements, ...resp]);
        }
      } else {
        if (param.offset === offset) {
          setRequirements([]);
        }
      }
    });
  }

  function removeRequirement(id: string): void {
    setRequirements(requirements.filter((r) => r.id !== id));
    setIterationRequirements(iterationRequirements.filter((r) => r.id !== id));
  }

  function updateRequirement(newReq: API.RequirementVO) {
    setRequirements(
      requirements.map((r) => {
        if (r.id === newReq.id) {
          return newReq;
        }
        return r;
      }),
    );
    setIterationRequirements(
      iterationRequirements.map((r) => {
        if (r.id === newReq.id) {
          return newReq;
        }
        return r;
      }),
    );
  }

  useEffect(() => {
    listCurrentUserProjectGroup().then((resp) => {
      setProjectGroups(resp);
    });
  }, []);

  useEffect(() => {
    if (!selectedIteration) {
      setProjects(undefined);
      setSearchParam(undefined);
      setPlanningTree(undefined);
      setProjectDetail(undefined);
      setTemplateDetail(undefined);
      setPlanningIteration(undefined);
      preSelectedIterationRef.current = undefined;
      return;
    }
    const { projectGroupId, projectId, iterationId } = selectedIteration;
    if (projectGroupId && preSelectedIterationRef.current?.projectGroupId !== projectGroupId) {
      listCurrentUserProject({ projectGroupId }).then((resp) => {
        setProjects(resp);
      });
    } else if (!projectGroupId) {
      setProjects(undefined);
    }

    if (projectId && preSelectedIterationRef.current?.projectId !== projectId) {
      setSearchParam({ projectId, offset, limit });
      getProjectDetail({ id: projectId }).then((resp) => {
        setProjectDetail(resp);
        getTemplateDetail({ id: resp.template.id }).then((tem) => setTemplateDetail(tem));
      });
      treeVersionDetail({ projectId }).then((resp) => {
        setPlanningTree(buildPlanningTreeData(resp));
      });
    } else if (!projectId) {
      setSearchParam(undefined);
      setPlanningTree(undefined);
      setProjectDetail(undefined);
      setTemplateDetail(undefined);
    }
    if (iterationId && preSelectedIterationRef.current?.iterationId !== iterationId) {
      getIterationDetail({ id: iterationId }).then((resp) => setPlanningIteration(resp));
      listRequirementByIterationId({ iterationId }).then((resp) => setIterationRequirements(resp));
    } else if (!iterationId) {
      setPlanningIteration(undefined);
    }
    preSelectedIterationRef.current = selectedIteration;
  }, [selectedIteration]);

  useEffect(() => {
    updateRequirements();
  }, [searchParam]);

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      return;
    }
    let requirementId = draggableId
      .replace(IdPrefix.RequirementPool, '')
      .replaceAll(IdPrefix.IterationPlanning, '');
    const copyRequirements = Array.from(requirements);
    const copyIterationReqs = Array.from(iterationRequirements);
    if (destination.droppableId === DroppableId.IterationPlanning) {
      // 移动到迭代
      const iterationId = selectedIteration?.iterationId;
      if (!iterationId) {
        messageApi.warning('请选择规划的迭代');
        return;
      }
      const removed = copyRequirements.splice(source.index, 1);
      setRequirements(copyRequirements);
      removed[0].iterationId = iterationId;
      copyIterationReqs.splice(destination.index, 0, removed[0]);
      setIterationRequirements(copyIterationReqs);
      planningRequirement({ requirementId, iterationId }).catch(() => {
        setRequirements(requirements);
        setIterationRequirements(iterationRequirements);
      });
    }
    if (destination.droppableId === DroppableId.RequirementPool) {
      const removed = copyIterationReqs.splice(source.index, 1);
      setIterationRequirements(copyIterationReqs);
      removed[0].iterationId = undefined;
      copyRequirements.splice(destination.index, 0, removed[0]);
      setRequirements(copyRequirements);
      // 移动到需求池
      planningRequirement({ requirementId }).catch(() => {
        setRequirements(requirements);
        setIterationRequirements(iterationRequirements);
      });
    }
  }

  return (
    <PageContainer title={false}>
      {contextHolder}
      <Card>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Form layout="inline">
            <Form.Item style={{ width: 300 }} name={'projectGroupId'} label={'项目组'}>
              <Select
                placeholder="请选择项目组"
                options={projectGroups}
                fieldNames={IdName}
                onChange={(val) => setSelectedIteration({ projectGroupId: val })}
              />
            </Form.Item>
            <Form.Item style={{ width: 300 }} name={'projectId'} label={'项目'}>
              <Select
                placeholder="请选择项目"
                options={projects}
                fieldNames={IdName}
                onChange={(val) => {
                  setSelectedIteration({
                    ...selectedIteration,
                    projectId: val,
                    versionId: undefined,
                  });
                }}
                notFoundContent={
                  <Empty
                    description={
                      selectedIteration?.projectGroupId ? '该项目组下暂无项目信息' : '请选择项目组'
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                }
              />
            </Form.Item>
          </Form>
          <Divider style={{ marginTop: token.margin, marginBottom: token.margin }} />
          <Row gutter={20}>
            <Col span={12}>
              <Flex justify={'space-between'} align={'center'} style={{ marginBottom: 10 }}>
                <ModalForm<API.AddRequirement>
                  key={'add'}
                  form={addForm}
                  title={'新建需求'}
                  layout={'horizontal'}
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                  submitter={{
                    render: (_, defaultDom) => {
                      return [
                        <Button
                          key="reset"
                          onClick={() => {
                            addForm.resetFields();
                          }}
                        >
                          重置
                        </Button>,
                        ...defaultDom,
                      ];
                    },
                  }}
                  trigger={
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        addForm.setFieldValue('reporterId', initialState?.currentUser?.id)
                      }
                    >
                      新建需求
                    </Button>
                  }
                  onFinish={async (values) => {
                    values.projectId = projectDetail?.id || '';
                    await addRequirement(values).then(() => {
                      updateRequirements();
                    });
                    addForm.resetFields();
                    return true;
                  }}
                >
                  <ProFormText
                    name={'title'}
                    label={'标题'}
                    rules={[{ required: true, max: 30 }]}
                  />
                  <ProFormSelect
                    name={'typeId'}
                    label={'类型'}
                    rules={[{ required: true }]}
                    options={templateDetail?.requirementTypes}
                    fieldProps={{ fieldNames: IdName }}
                  />
                  <ProFormSelect
                    name={'priorityId'}
                    label={'优先级'}
                    rules={[{ required: true }]}
                    options={templateDetail?.requirementPriorities}
                    fieldProps={{ fieldNames: IdName }}
                  />
                  <ProFormSelect
                    name={'reporterId'}
                    label={'报告人'}
                    rules={[{ required: true }]}
                    options={projectDetail?.members}
                    fieldProps={{ fieldNames: IdUsername }}
                  />
                  <ProFormSelect
                    name={'handlerId'}
                    label={'处理人'}
                    rules={[{ required: true }]}
                    options={projectDetail?.members}
                    fieldProps={{ fieldNames: IdUsername }}
                  />
                  <ProFormTextArea name={'description'} label={'描述'} rules={[{ max: 255 }]} />
                </ModalForm>
                <Form form={searchForm}>
                  <Flex justify={'space-between'} align={'center'} gap={'small'}>
                    <Form.Item noStyle name={'priorityId'}>
                      <Select
                        allowClear
                        placeholder="优先级"
                        options={templateDetail?.requirementPriorities}
                        fieldNames={IdName}
                      />
                    </Form.Item>
                    <Form.Item noStyle name={'typeId'}>
                      <Select
                        allowClear
                        placeholder="需求类型"
                        options={templateDetail?.requirementTypes}
                        fieldNames={IdName}
                      />
                    </Form.Item>
                    <Form.Item noStyle name={'title'}>
                      <Input.Search
                        allowClear
                        enterButton
                        placeholder="请输入需求标题"
                        onSearch={() => {
                          const params = searchForm.getFieldsValue(true);
                          setSearchParam({
                            ...searchParam,
                            offset,
                            limit,
                            ...params,
                          });
                        }}
                      />
                    </Form.Item>
                  </Flex>
                </Form>
              </Flex>
              <Droppable droppableId={DroppableId.RequirementPool}>
                {(droppableProvided, snapshot) => {
                  const isDraggingOver = snapshot.isDraggingOver;
                  return (
                    <div ref={droppableProvided.innerRef}>
                      <List<API.RequirementVO>
                        style={containerStyle}
                        dataSource={requirements}
                        renderItem={(item, index) => {
                          const draggableId = IdPrefix.RequirementPool + item.id;
                          return (
                            <>
                              <Draggable draggableId={draggableId} index={index} key={draggableId}>
                                {(draggableProvider) => {
                                  return (
                                    <div
                                      {...draggableProvider.draggableProps}
                                      {...draggableProvider.dragHandleProps}
                                      ref={draggableProvider.innerRef}
                                    >
                                      {templateDetail && projectDetail && (
                                        <div style={{ padding: 5 }}>
                                          <RequirementCard
                                            projectDetail={projectDetail}
                                            template={templateDetail}
                                            requirement={item}
                                            afterDelete={() => removeRequirement(item.id)}
                                            afterUpdate={(newReq) => updateRequirement(newReq)}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                }}
                              </Draggable>
                              {index === requirements.length - 1 &&
                                !isDraggingOver &&
                                (hasMore ? (
                                  <Button
                                    block
                                    type="text"
                                    size="small"
                                    onClick={() => {
                                      if (searchParam) {
                                        setSearchParam({
                                          ...searchParam,
                                          offset: (
                                            Number(searchParam.offset) + Number(limit)
                                          ).toString(),
                                        });
                                      }
                                    }}
                                  >
                                    加载更多...
                                  </Button>
                                ) : (
                                  <Divider plain>已无更多待规划的需求</Divider>
                                ))}
                            </>
                          );
                        }}
                      />

                      {droppableProvided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </Col>
            <Col span={12}>
              <Flex justify={'flex-end'} align={'center'} style={{ marginBottom: 10 }}>
                <Flex justify={'space-between'} align={'center'} gap={'small'}>
                  <TreeSelect
                    treeLine
                    labelInValue
                    treeDefaultExpandAll
                    treeData={planningTree}
                    placeholder={'请选择要规划的迭代'}
                    treeTitleRender={(node) => (
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
                    style={{ width: 366 }}
                    onSelect={(iterationId) => {
                      if (selectedIteration) {
                        setSelectedIteration({ ...selectedIteration, iterationId });
                      }
                    }}
                  />
                  <Button type="text" icon={<SendOutlined />}>
                    Kanban
                  </Button>
                </Flex>
              </Flex>
              {planningIteration ? (
                <div style={containerStyle}>
                  <Descriptions
                    bordered
                    column={2}
                    size="small"
                    items={[
                      { label: '迭代名称', children: planningIteration.name, span: 2 },
                      { label: '迭代ID', children: planningIteration.id },
                      {
                        label: '迭代状态',
                        children: (
                          <Tag color={planningStatusColor(planningIteration.status)}>
                            {planningStatusLabel(planningIteration.status)}
                          </Tag>
                        ),
                      },
                      { label: '计划开始时间', children: planningIteration.plannedStartTime },
                      { label: '计划结束时间', children: planningIteration.plannedEndTime },
                      { label: '描述', children: planningIteration.description, span: 2 },
                    ]}
                  />
                  <Droppable droppableId={DroppableId.IterationPlanning}>
                    {(droppableProvided) => (
                      <div ref={droppableProvided.innerRef}>
                        <List<API.RequirementVO>
                          style={{ marginTop: 10 }}
                          dataSource={iterationRequirements}
                          renderItem={(item, index) => {
                            const draggableId = IdPrefix.IterationPlanning + item.id;
                            return (
                              <Draggable draggableId={draggableId} index={index} key={draggableId}>
                                {(draggableProvider) => {
                                  return (
                                    <div
                                      {...draggableProvider.draggableProps}
                                      {...draggableProvider.dragHandleProps}
                                      ref={draggableProvider.innerRef}
                                    >
                                      {templateDetail && projectDetail && (
                                        <div style={{ padding: 5 }}>
                                          <RequirementCard
                                            projectDetail={projectDetail}
                                            template={templateDetail}
                                            requirement={item}
                                            afterDelete={() => removeRequirement(item.id)}
                                            afterUpdate={(newReq) => updateRequirement(newReq)}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          }}
                        />
                        {droppableProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ) : (
                <Empty
                  style={{ marginTop: 100 }}
                  description="请选择要规划的迭代"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Col>
          </Row>
        </DragDropContext>
      </Card>
    </PageContainer>
  );
};

export default RequirementPlanning;
