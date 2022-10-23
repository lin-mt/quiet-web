import React, { useState } from 'react';
import styles from '@/pages/scrum/iteration-kanban/style/index.module.less';
import { ScrumDemand, ScrumTask, ScrumTaskStep } from '@/service/scrum/type';
import { Grid } from '@arco-design/web-react';
import DemandCard from '@/components/scrum/DemandCard';
import { saveTask } from '@/service/scrum/task';
import TaskForm, { TaskFormProps } from '@/components/scrum/TaskForm';
import TaskCard from '@/components/scrum/TaskCard';

const { Row, Col } = Grid;

const columnWidth = 300;
const columnGutter = 10;
const columnRadius = 4;

export type KanbanRowProps = {
  userId2fullName: Record<string, string>;
  taskTypeKey2name: Record<string, string>;
  demandTypeKey2name: Record<string, string>;
  taskStepId2info: Record<string, ScrumTaskStep>;
  priorityId2color: Record<string, string>;
  demandId2info: Record<string, ScrumDemand>;
  demandId2TaskStepTasks: Record<string, Record<string, ScrumTask[]>>;
  handleNewTask: (task: ScrumTask) => void;
};

function Kanban(props: KanbanRowProps) {
  const {
    userId2fullName,
    taskTypeKey2name,
    demandTypeKey2name,
    demandId2TaskStepTasks,
    taskStepId2info,
    demandId2info,
    priorityId2color,
  } = props;

  const rowWidth =
    (Object.keys(taskStepId2info).length + 1) * (columnWidth + columnGutter) -
    columnGutter;

  const [taskFormProps, setTaskFormProps] = useState<TaskFormProps>();

  function handleCreateTask(demandId: string) {
    const taskStepId = Object.keys(taskStepId2info)[0];
    setTaskFormProps({
      title: '创建任务',
      visible: true,
      demandId,
      taskStepId: taskStepId2info[taskStepId].id,
      userOptions: Object.keys(userId2fullName).map((key) => ({
        label: userId2fullName[key],
        value: key,
      })),
      onOk: (values) => {
        return saveTask(values).then((resp) => {
          props.handleNewTask(resp);
          setTaskFormProps({ visible: false });
        });
      },
      onCancel: () => setTaskFormProps({ visible: false }),
    });
  }

  return (
    <div
      style={{
        width: '100%',
        overflow: 'scroll',
        paddingLeft: 5,
        paddingRight: 5,
      }}
    >
      <div style={{ width: rowWidth }}>
        <Row gutter={columnGutter}>
          <Col flex={1}>
            <div
              className={styles['block']}
              style={{
                width: columnWidth,
                borderStartStartRadius: columnRadius,
                borderStartEndRadius: columnRadius,
              }}
            >
              <h4 className={styles['title']}>迭代需求</h4>
            </div>
          </Col>
          {Object.keys(taskStepId2info).map((id) => {
            return (
              <Col flex={1} key={id}>
                <div
                  className={styles['block']}
                  style={{
                    width: columnWidth,
                    borderStartStartRadius: columnRadius,
                    borderStartEndRadius: columnRadius,
                  }}
                >
                  <h4 className={styles['title']}>
                    {taskStepId2info[id].name}
                  </h4>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
      {Object.keys(demandId2info).map((demandId, index) => {
        const blockRadius =
          Object.keys(demandId2info).length === index + 1
            ? columnRadius
            : 'unset';
        return (
          <div key={demandId} style={{ width: rowWidth }}>
            <Row gutter={columnGutter} align={'stretch'}>
              <Col flex={1}>
                <div
                  className={styles['block']}
                  style={{
                    width: columnWidth,
                    height: '100%',
                    borderEndStartRadius: blockRadius,
                    borderEndEndRadius: blockRadius,
                  }}
                >
                  <div style={{ padding: '0 10px 10px 10px' }}>
                    <DemandCard
                      demand={demandId2info[demandId]}
                      typeKey2Name={demandTypeKey2name}
                      priorityId2Color={priorityId2color}
                    />
                    <div
                      style={{
                        marginTop: 3,
                        textAlign: 'right',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          cursor: 'pointer',
                          color: 'rgb(var(--primary-6))',
                        }}
                        onClick={() => handleCreateTask(demandId)}
                      >
                        + 创建任务
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
              {Object.keys(taskStepId2info).map((tsId) => {
                const tasks =
                  demandId2TaskStepTasks[demandId] &&
                  demandId2TaskStepTasks[demandId][tsId];
                return (
                  <Col flex={1} key={tsId}>
                    <div
                      className={styles['block']}
                      style={{
                        width: columnWidth,
                        height: '100%',
                        borderEndStartRadius: blockRadius,
                        borderEndEndRadius: blockRadius,
                      }}
                    >
                      {tasks?.map((task) => {
                        return (
                          <div
                            key={task.id}
                            style={{ padding: '0 10px 10px 10px' }}
                          >
                            <TaskCard
                              task={task}
                              typeKey2Name={taskTypeKey2name}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        );
      })}
      <TaskForm {...taskFormProps} />
    </div>
  );
}

export default Kanban;
