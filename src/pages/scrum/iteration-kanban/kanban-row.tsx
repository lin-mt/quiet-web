import React, { useEffect, useState } from 'react';
import DemandCard from '@/components/scrum/DemandCard';
import TaskCard from '@/components/scrum/TaskCard';
import { Grid, Message } from '@arco-design/web-react';
import { ScrumDemand, ScrumTask, ScrumTaskStep } from '@/service/scrum/type';
import { saveTask } from '@/service/scrum/task';
import TaskForm, { TaskFormProps } from '@/components/scrum/TaskForm';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import styles from '@/pages/scrum/iteration-kanban/style/index.module.less';

const { Row, Col } = Grid;

const Block = (props) => {
  return (
    <div
      style={{
        height: '100%',
        backgroundColor: props.backgroundColor,
        borderEndEndRadius: `${props.blockRadius}px`,
        borderEndStartRadius: `${props.blockRadius}px`,
      }}
    >
      {props.children}
    </div>
  );
};

export type MoveTask = {
  demandId: string;
  taskId: string;
  fromTaskStepId: string;
  fromIndex: number;
  toTaskStepId: string;
  toIndex: number;
};

export type KanbanRowProps = {
  demandId: string;
  rowWidth: number;
  columnGutter: number;
  columnDefaultBc: string;
  blockRadius: number;
  isDropDisabled: boolean;
  userId2fullName: Record<string, string>;
  taskTypeKey2name: Record<string, string>;
  demandTypeKey2name: Record<string, string>;
  taskStepId2info: Record<string, ScrumTaskStep>;
  priorityId2color: Record<string, string>;
  demandId2info: Record<string, ScrumDemand>;
  demandId2TaskStepTasks: Record<string, Record<string, ScrumTask[]>>;
  handleNewTask: (task: ScrumTask) => void;
  handleDeleteTask: (task: ScrumTask) => void;
  handleMoveTask: (params: MoveTask) => void;
};

function KanbanRow(props: KanbanRowProps) {
  const {
    demandId,
    rowWidth,
    columnGutter,
    columnDefaultBc,
    blockRadius,
    isDropDisabled,
    userId2fullName,
    taskTypeKey2name,
    demandTypeKey2name,
    taskStepId2info,
    priorityId2color,
    demandId2info,
    demandId2TaskStepTasks,
    handleNewTask,
    handleDeleteTask,
    handleMoveTask,
  } = props;

  const [columnBgc, setColumnBgc] = useState<string>();
  const [taskFormProps, setTaskFormProps] = useState<TaskFormProps>();

  useEffect(() => {
    setColumnBgc(columnDefaultBc);
  }, [columnDefaultBc]);

  function handleCreateTask(demandId: string) {
    const taskStepId = Object.keys(taskStepId2info)[0];
    setTaskFormProps({
      demandId,
      taskStepId,
      title: '创建任务',
      visible: true,
      userOptions: Object.keys(userId2fullName).map((key) => ({
        label: userId2fullName[key],
        value: key,
      })),
      onOk: (values) => {
        return saveTask(values).then((resp) => {
          handleNewTask(resp);
          setTaskFormProps({ visible: false });
        });
      },
      onCancel: () => setTaskFormProps({ visible: false }),
    });
  }

  function handleDragEnd(result: DropResult) {
    if (isDropDisabled) {
      Message.info('迭代未开始或已结束，无法变更任务状态～');
    }
    const { destination, source, draggableId } = result;
    const ignore =
      !destination || destination.droppableId === source.droppableId;
    if (!ignore) {
      handleMoveTask({
        demandId,
        taskId: draggableId,
        fromTaskStepId: source.droppableId,
        fromIndex: source.index,
        toTaskStepId: destination.droppableId,
        toIndex: destination.index,
      });
    }
    setColumnBgc(columnDefaultBc);
  }

  function handleDragStart() {
    setColumnBgc('var(--color-fill-3)');
  }

  return (
    <div style={{ width: rowWidth }}>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Row gutter={columnGutter} align={'stretch'}>
          <Col flex={1}>
            <Block backgroundColor={columnDefaultBc} blockRadius={blockRadius}>
              <div className={styles['card-wrapper']}>
                <DemandCard
                  demand={demandId2info[demandId]}
                  typeKey2Name={demandTypeKey2name}
                  priorityId2Color={priorityId2color}
                />
                <div className={styles['option']}>
                  <span
                    className={styles['create-task']}
                    onClick={() => handleCreateTask(demandId)}
                  >
                    + 创建任务
                  </span>
                </div>
              </div>
            </Block>
          </Col>
          {Object.keys(taskStepId2info).map((tsId) => {
            const tasks =
              demandId2TaskStepTasks[demandId] &&
              demandId2TaskStepTasks[demandId][tsId];
            return (
              <Col flex={1} key={tsId}>
                <Block backgroundColor={columnBgc} blockRadius={blockRadius}>
                  <Droppable droppableId={tsId} isDropDisabled={isDropDisabled}>
                    {(droppableProvided, snapshot) => (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: snapshot.isDraggingOver
                            ? 'var(--color-fill-4)'
                            : 'unset',
                        }}
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                      >
                        {tasks?.map((task, index) => {
                          return (
                            <div
                              key={task.id}
                              className={styles['card-wrapper']}
                            >
                              <Draggable
                                draggableId={task.id}
                                index={index}
                                key={index}
                              >
                                {(draggableProvider) => (
                                  <div
                                    {...draggableProvider.draggableProps}
                                    {...draggableProvider.dragHandleProps}
                                    ref={draggableProvider.innerRef}
                                  >
                                    <TaskCard
                                      task={task}
                                      typeKey2name={taskTypeKey2name}
                                      userId2fullName={userId2fullName}
                                      afterDelete={() => {
                                        if (handleDeleteTask) {
                                          handleDeleteTask(task);
                                        }
                                      }}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            </div>
                          );
                        })}
                        {droppableProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Block>
              </Col>
            );
          })}
        </Row>
      </DragDropContext>

      <TaskForm {...taskFormProps} />
    </div>
  );
}

export default KanbanRow;
