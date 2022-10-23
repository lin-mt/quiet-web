import React, { useEffect, useState } from 'react';
import DemandCard from '@/components/scrum/DemandCard';
import TaskCard from '@/components/scrum/TaskCard';
import { Grid } from '@arco-design/web-react';
import { ScrumDemand, ScrumTask, ScrumTaskStep } from '@/service/scrum/type';
import { saveTask } from '@/service/scrum/task';
import TaskForm, { TaskFormProps } from '@/components/scrum/TaskForm';
import styled from 'styled-components';

const { Row, Col } = Grid;

const CreateTask = styled.span`
  font-size: 12px;
  cursor: pointer;
  color: rgb(var(--primary-6));
`;

const OptionContainer = styled.div`
  margin-top: 3px;
  text-align: right;
`;

const CardWrapper = styled.div`
  padding: 7px 10px;
`;

export type KanbanRowProps = {
  demandId: string;
  rowWidth: number;
  columnGutter: number;
  columnWidth: number;
  columnDefaultBc: string;
  blockRadius: string | number;
  userId2fullName: Record<string, string>;
  taskTypeKey2name: Record<string, string>;
  demandTypeKey2name: Record<string, string>;
  taskStepId2info: Record<string, ScrumTaskStep>;
  priorityId2color: Record<string, string>;
  demandId2info: Record<string, ScrumDemand>;
  demandId2TaskStepTasks: Record<string, Record<string, ScrumTask[]>>;
  handleNewTask: (task: ScrumTask) => void;
  handleDeleteTask: (task: ScrumTask) => void;
};

function KanbanRow(props: KanbanRowProps) {
  const {
    demandId,
    rowWidth,
    columnGutter,
    columnWidth,
    columnDefaultBc,
    blockRadius,
    userId2fullName,
    taskTypeKey2name,
    demandTypeKey2name,
    taskStepId2info,
    priorityId2color,
    demandId2info,
    demandId2TaskStepTasks,
    handleNewTask,
    handleDeleteTask,
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
      title: '创建任务',
      visible: true,
      taskStepId: taskStepId2info[taskStepId].id,
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

  return (
    <div key={demandId} style={{ width: rowWidth }}>
      <Row gutter={columnGutter} align={'stretch'}>
        <Col flex={1}>
          <div
            style={{
              height: '100%',
              width: columnWidth,
              backgroundColor: columnBgc,
              borderEndStartRadius: blockRadius,
              borderEndEndRadius: blockRadius,
            }}
          >
            <CardWrapper>
              <DemandCard
                demand={demandId2info[demandId]}
                typeKey2Name={demandTypeKey2name}
                priorityId2Color={priorityId2color}
              />
              <OptionContainer>
                <CreateTask onClick={() => handleCreateTask(demandId)}>
                  + 创建任务
                </CreateTask>
              </OptionContainer>
            </CardWrapper>
          </div>
        </Col>
        {Object.keys(taskStepId2info).map((tsId) => {
          const tasks =
            demandId2TaskStepTasks[demandId] &&
            demandId2TaskStepTasks[demandId][tsId];
          return (
            <Col flex={1} key={tsId}>
              <div
                style={{
                  height: '100%',
                  width: columnWidth,
                  backgroundColor: columnBgc,
                  borderEndStartRadius: blockRadius,
                  borderEndEndRadius: blockRadius,
                }}
              >
                {tasks?.map((task) => {
                  return (
                    <CardWrapper key={task.id}>
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
                    </CardWrapper>
                  );
                })}
              </div>
            </Col>
          );
        })}
      </Row>
      <TaskForm {...taskFormProps} />
    </div>
  );
}

export default KanbanRow;
