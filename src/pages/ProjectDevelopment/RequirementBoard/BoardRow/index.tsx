import RequirementCard from '@/components/RequirementCard';
import TaskCard from '@/components/TaskCard';
import { addTask, moveTask } from '@/services/quiet/taskController';
import { ApiMethod, idName, idUsername } from '@/util/Utils';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormItem,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';
import { useModel } from '@umijs/max';
import { Button, Col, Flex, Form, Row, theme } from 'antd';
import _ from 'lodash';
import { CSSProperties, useEffect, useState } from 'react';

type TaskRowProps = {
  requirementTask: API.RequirementTask;
  colGutter: number;
  colWidth: number;
  projectDetail: API.ProjectDetail;
  templateDetail: API.TemplateDetail;
  containerStyle: CSSProperties;
};

function BoardRow(props: TaskRowProps) {
  const { requirementTask, colGutter, colWidth, containerStyle, projectDetail, templateDetail } =
    props;

  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const [addTaskForm] = Form.useForm();
  const addTaskTypeId = Form.useWatch('typeId', addTaskForm);
  const [isBackendApi, setIsBackendApi] = useState<boolean>(false);
  const [taskContainerBgColor, setTaskContainerBgColor] = useState<string>();
  const [requirementTasks, setRequirementTasks] = useState<Record<string, any> | undefined>(
    requirementTask.tasks,
  );

  useEffect(() => {
    setRequirementTasks(requirementTask.tasks);
  }, [requirementTask.tasks]);

  useEffect(() => {
    if (!addTaskTypeId) {
      setIsBackendApi(false);
    } else {
      const taskType = templateDetail.taskTypes.find((t) => t.id === addTaskTypeId);
      setIsBackendApi(!!taskType?.backendApi);
    }
  }, [addTaskTypeId]);

  function handleTaskDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination || !requirementTasks) {
      setTaskContainerBgColor(undefined);
      return;
    }
    if (destination.droppableId === source.droppableId) {
      setTaskContainerBgColor(undefined);
      return;
    }
    const preRequirementTasks = _.clone(requirementTasks);
    const sourceTasks: API.TaskVO[] = requirementTasks[source.droppableId];
    const destinationTasks: API.TaskVO[] = requirementTasks[destination.droppableId];
    const clonedSourceTasks = Array.from(sourceTasks);
    let clonedDestinationTasks = Array.from(destinationTasks || []);
    clonedDestinationTasks = clonedDestinationTasks ? clonedDestinationTasks : [];
    const task = clonedSourceTasks.splice(source.index, 1)[0];
    task.taskStepId = destination.droppableId;
    clonedDestinationTasks.splice(destination.index, 0, task);
    const newRequirementTasks = _.clone(requirementTasks);
    newRequirementTasks[source.droppableId] = clonedSourceTasks;
    newRequirementTasks[destination.droppableId] = clonedDestinationTasks;
    setRequirementTasks(newRequirementTasks);
    moveTask({ id: draggableId, taskStepId: destination.droppableId })
      .catch(() => setRequirementTasks(preRequirementTasks))
      .finally(() => {
        setTaskContainerBgColor(undefined);
      });
  }

  const graggingOverBgColor = '#bfbfbf';

  function handleTaskDragStart(): void {
    setTaskContainerBgColor('#d9d9d9');
  }

  return (
    <DragDropContext onDragEnd={handleTaskDragEnd} onDragStart={handleTaskDragStart}>
      <Row
        gutter={[colGutter, 0]}
        style={{
          width: `${
            colWidth * (templateDetail?.taskSteps.length ? templateDetail?.taskSteps.length + 1 : 1)
          }px`,
        }}
      >
        <Col flex={`${colWidth}px`}>
          <div style={containerStyle}>
            {projectDetail && templateDetail && (
              <RequirementCard
                projectDetail={projectDetail}
                template={templateDetail}
                requirement={requirementTask}
              />
            )}
            <Flex justify="flex-end" align="center">
              <ModalForm<API.AddTask>
                form={addTaskForm}
                title="新建任务"
                layout={'horizontal'}
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
                submitter={{
                  render: (_, defaultDom) => {
                    return [
                      <Button
                        key="reset"
                        onClick={() => {
                          addTaskForm.resetFields();
                        }}
                      >
                        重置
                      </Button>,
                      ...defaultDom,
                    ];
                  },
                }}
                onFinish={async (values) => {
                  values.projectId = projectDetail?.id || '';
                  values.requirementId = requirementTask.id;
                  await addTask(values).then(() => {
                    if (!requirementTasks) {
                      return;
                    }
                    const clone = _.clone(requirementTasks);
                    let tasks = clone[templateDetail.taskSteps[0].id];
                    if (!tasks) {
                      clone[templateDetail.taskSteps[0].id] = [];
                    }
                    clone[templateDetail.taskSteps[0].id].push(values);
                    setRequirementTasks(clone);
                  });
                  addTaskForm.resetFields();
                  return true;
                }}
                trigger={
                  <Button
                    size="small"
                    type="text"
                    icon={<PlusOutlined />}
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      padding: '0 8px',
                      height: 20,
                      color: token.colorPrimary,
                    }}
                    onClick={() =>
                      addTaskForm.setFieldValue('reporterId', initialState?.currentUser?.id)
                    }
                  >
                    新建任务
                  </Button>
                }
              >
                <ProFormText name={'title'} label={'标题'} rules={[{ required: true, max: 30 }]} />
                <ProFormSelect
                  name={'typeId'}
                  label={'类型'}
                  rules={[{ required: true }]}
                  options={templateDetail?.taskTypes}
                  fieldProps={{ fieldNames: idName }}
                />
                {isBackendApi && (
                  <ProFormItem
                    name={'apiInfo'}
                    label={'接口信息'}
                    required
                    style={{ marginBottom: 0 }}
                  >
                    <ProFormSelect
                      name={['apiInfo', 'method']}
                      options={Object.values(ApiMethod)}
                      placeholder={'请选择请求方法'}
                      rules={[{ required: true, message: '请选择请求方法' }]}
                    />
                    <ProFormText
                      required
                      name={['apiInfo', 'path']}
                      label={'Path'}
                      placeholder={'请输入接口请求路径'}
                    />
                  </ProFormItem>
                )}
                <ProFormSelect
                  name={'reporterId'}
                  label={'报告人'}
                  rules={[{ required: true }]}
                  options={projectDetail?.members}
                  fieldProps={{ fieldNames: idUsername }}
                />
                <ProFormSelect
                  name={'handlerId'}
                  label={'处理人'}
                  rules={[{ required: true }]}
                  options={projectDetail?.members}
                  fieldProps={{ fieldNames: idUsername }}
                />
                <ProFormTextArea name={'description'} label={'描述'} rules={[{ max: 255 }]} />
              </ModalForm>
            </Flex>
          </div>
        </Col>
        {templateDetail?.taskSteps.map((step) => {
          const tasks: API.TaskVO[] = requirementTasks?.[step.id];
          let content: any = (
            <Droppable droppableId={step.id}>
              {(droppableProvided, snapshot) => {
                const isDraggingOver = snapshot.isDraggingOver;
                return (
                  <div
                    ref={droppableProvided.innerRef}
                    style={{
                      ...containerStyle,
                      backgroundColor: isDraggingOver
                        ? graggingOverBgColor
                        : taskContainerBgColor || containerStyle.backgroundColor,
                    }}
                  >
                    {droppableProvided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          );
          if (tasks && tasks.length > 0) {
            content = (
              <div style={{ height: '100%' }}>
                <Droppable droppableId={step.id}>
                  {(droppableProvided, snapshot) => {
                    const isDraggingOver = snapshot.isDraggingOver;
                    return (
                      <div
                        ref={droppableProvided.innerRef}
                        style={{
                          ...containerStyle,
                          backgroundColor: isDraggingOver
                            ? graggingOverBgColor
                            : taskContainerBgColor || containerStyle.backgroundColor,
                        }}
                      >
                        {tasks.map((task, index) => {
                          return (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(draggableProvider) => {
                                return (
                                  <div style={{ width: '100%', marginTop: index !== 0 ? 8 : 0 }}>
                                    <div
                                      {...draggableProvider.draggableProps}
                                      {...draggableProvider.dragHandleProps}
                                      ref={draggableProvider.innerRef}
                                    >
                                      {projectDetail && templateDetail && (
                                        <TaskCard
                                          projectDetail={projectDetail}
                                          template={templateDetail}
                                          task={task}
                                          afterDelete={() => {
                                            if (!requirementTasks) {
                                              return;
                                            }
                                            const clone: API.TaskVO[] = Array.from(
                                              requirementTasks[step.id],
                                            );
                                            clone.splice(index, 1);
                                            const newRequirementTasks = _.clone(requirementTasks);
                                            newRequirementTasks[step.id] = clone;
                                            setRequirementTasks(newRequirementTasks);
                                          }}
                                        />
                                      )}
                                      {droppableProvided.placeholder}
                                    </div>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          }
          return (
            <Col key={requirementTask.id + '_' + step.id} flex={`${colWidth}px`}>
              {content}
            </Col>
          );
        })}
      </Row>
    </DragDropContext>
  );
}

export default BoardRow;
