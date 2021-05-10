import { Col, Space } from 'antd';
import DemandCard from '@/pages/scrum/demand/components/DemandCard';
import type { ScrumDemand, ScrumTask, ScrumTaskStep } from '@/services/scrum/EntitiyType';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import React, { useState } from 'react';
import TaskForm from '@/pages/scrum/task/components/TaskForm';
import type { QuietUser } from '@/services/system/EntityType';
import TaskCard from '@/pages/scrum/task/components/TaskCard';
import { deleteTask, findAllTaskByDemandIds } from '@/services/scrum/ScrumTask';

const CardContainer = styled(Col)`
  width: 260px;
  min-height: 86px;
  padding: 6px 6px 6px 6px;
  background-color: white;
  border-radius: 6px;
`;

const CreateTask = styled.a`
  font-size: 12px;
`;

interface IterationRowProps {
  demand: ScrumDemand;
  demandTypeLabels: Record<string, string>;
  taskTypeLabels: Record<string, string>;
  priorityColors: Record<string, string>;
  taskSteps: ScrumTaskStep[];
  members: Record<string, QuietUser>;
  taskStepTasks?: Record<string, ScrumTask[]>;
}

export default ({
  demand,
  demandTypeLabels,
  taskTypeLabels,
  priorityColors,
  taskSteps,
  members,
  taskStepTasks,
}: IterationRowProps) => {
  const [taskFormVisible, setTaskFormVisible] = useState<boolean>(false);
  const [taskUpdateInfo, setTaskUpdateInfo] = useState<ScrumTask>();
  const [taskStepToTasks, setTaskStepToTasks] = useState<Record<string, ScrumTask[]>>({
    ...taskStepTasks,
  });

  function handleCreateTaskClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setTaskUpdateInfo(undefined);
    setTaskFormVisible(true);
  }

  function handleTaskCardEdit(task: ScrumTask) {
    setTaskUpdateInfo(task);
    setTaskFormVisible(true);
  }

  function reloadDemandTasks() {
    findAllTaskByDemandIds([demand.id]).then((resp) => {
      setTaskStepToTasks(resp[demand.id]);
    });
  }

  async function handleTaskCardDelete(task: ScrumTask) {
    await deleteTask(task.id);
    reloadDemandTasks();
  }

  return (
    <>
      <Space align={'start'} style={{ backgroundColor: 'white' }}>
        <CardContainer>
          <DemandCard
            cardStyle={{ width: 248, cursor: 'pointer' }}
            demand={demand}
            demandTypeLabels={demandTypeLabels}
            priorityColors={priorityColors}
          />
        </CardContainer>
        {taskSteps.map((taskStep, index) => {
          const cardContainerKey = `${demand.id}-${taskStep.id}`;
          let taskInfos: React.ReactNode;
          if (taskStepToTasks) {
            const tasks: ScrumTask[] = taskStepToTasks[taskStep.id];
            if (tasks) {
              taskInfos = tasks.map((task, taskIndex) => {
                return (
                  <TaskCard
                    cardStyle={{ marginTop: taskIndex === 0 ? 0 : 6 }}
                    key={task.id}
                    task={task}
                    executorName={members[task.executorId].fullName}
                    taskTypeLabels={taskTypeLabels}
                    onEditClick={() => handleTaskCardEdit(task)}
                    onDeleteClick={() => handleTaskCardDelete(task)}
                  />
                );
              });
            }
          }
          return (
            <CardContainer key={cardContainerKey}>
              {taskInfos}
              {index === 0 && (
                <CreateTask onClick={(e) => handleCreateTaskClick(e)}>
                  <PlusOutlined />
                  创建任务
                </CreateTask>
              )}
            </CardContainer>
          );
        })}
      </Space>
      {taskFormVisible && (
        <TaskForm
          taskStepId={taskSteps[0].id}
          visible={taskFormVisible}
          updateInfo={taskUpdateInfo}
          onCancel={() => {
            setTaskFormVisible(false);
            reloadDemandTasks();
          }}
          executors={Object.keys(members).map((key) => members[key])}
          demandId={demand.id}
        />
      )}
    </>
  );
};
