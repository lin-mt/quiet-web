import { Col, message, Space } from 'antd';
import DemandCard from '@/pages/scrum/demand/components/DemandCard';
import type { ScrumDemand, ScrumTask, ScrumTaskStep } from '@/services/scrum/EntitiyType';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import React, { useState } from 'react';
import TaskForm from '@/pages/scrum/task/components/TaskForm';
import type { QuietUser } from '@/services/system/EntityType';
import TaskCard from '@/pages/scrum/task/components/TaskCard';
import { deleteTask, findAllTaskByDemandIds, updateTask } from '@/services/scrum/ScrumTask';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const CardContainer = styled(Col)`
  width: 260px;
  padding: 6px 6px 6px 6px;
  border-radius: 6px;
`;

interface IterationRowProps {
  demand: ScrumDemand;
  taskDragDisabled: boolean;
  taskCanBeCreated: () => boolean;
  demandTypeLabels: Record<string, string>;
  taskTypeLabels: Record<string, string>;
  priorityColors: Record<string, string>;
  taskSteps: ScrumTaskStep[];
  members: Record<string, QuietUser>;
  taskStepTasks?: Record<string, ScrumTask[]>;
}

export default ({
  demand,
  taskDragDisabled,
  taskCanBeCreated,
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

  function calculateDroppableMinHeight(): number {
    let maxCount = 1;
    if (taskStepToTasks) {
      Object.keys(taskStepToTasks).forEach((key) => {
        maxCount = maxCount < taskStepToTasks[key].length ? taskStepToTasks[key].length : maxCount;
      });
    }
    return maxCount * 80;
  }

  function handleCreateTaskClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (taskCanBeCreated()) {
      setTaskUpdateInfo(undefined);
      setTaskFormVisible(true);
    }
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

  function handleOnDragEnd({ destination, source, draggableId }: DropResult) {
    if (taskDragDisabled) {
      message.warn('迭代未开始或已结束，无法修改任务状态').then();
      return;
    }
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      return;
    }
    let operatingTask: ScrumTask | undefined;
    taskStepToTasks[source.droppableId].every((datum) => {
      if (datum.id === draggableId) {
        operatingTask = datum;
        return false;
      }
      return true;
    });
    if (operatingTask) {
      operatingTask.task_step_id = destination.droppableId;
      updateTask(operatingTask).then((result) => {
        if (result.task_step_id !== destination.droppableId) {
          message.error('操作失败，请联系管理员！').then(() => window.location.reload());
        }
      });
      const sourceTasks = Array.from(taskStepToTasks[source.droppableId]);
      sourceTasks.splice(source.index, 1);
      let destinationTasks: ScrumTask[] = [];
      if (taskStepToTasks[destination.droppableId]) {
        destinationTasks = Array.from(taskStepToTasks[destination.droppableId]);
      }
      destinationTasks.splice(destination.index, 0, operatingTask);
      const newTaskStepToTasks = {
        ...taskStepToTasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks,
      };
      setTaskStepToTasks(newTaskStepToTasks);
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Space direction={'vertical'} style={{ backgroundColor: 'white', borderRadius: 3 }}>
          <Space align={'start'}>
            <CardContainer style={{ paddingBottom: 0 }}>
              <DemandCard
                cardStyle={{ width: 248, cursor: 'pointer' }}
                demand={demand}
                demandTypeLabels={demandTypeLabels}
                priorityColors={priorityColors}
              />
              <div
                style={{
                  fontSize: 12,
                  paddingTop: 3,
                  marginLeft: 188,
                }}
              >
                <a onClick={(e) => handleCreateTaskClick(e)}>
                  <PlusOutlined />
                  创建任务
                </a>
              </div>
            </CardContainer>
            {taskSteps.map((taskStep) => {
              const cardContainerKey = `${demand.id}-${taskStep.id}`;
              let taskInfos: React.ReactNode;
              if (taskStepToTasks) {
                const tasks: ScrumTask[] = taskStepToTasks[taskStep.id];
                if (tasks) {
                  taskInfos = tasks.map((task, taskIndex) => {
                    return (
                      <Draggable draggableId={task.id} index={taskIndex} key={task.id}>
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <TaskCard
                              cardStyle={{ marginTop: taskIndex === 0 ? 0 : 6 }}
                              task={task}
                              taskType={taskTypeLabels[task.type]}
                              executorName={members[task.executor_id].full_name}
                              onEditClick={() => handleTaskCardEdit(task)}
                              onDeleteClick={() => handleTaskCardDelete(task)}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  });
                }
              }
              return (
                <Droppable droppableId={taskStep.id} type="TASK" key={cardContainerKey}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: calculateDroppableMinHeight(),
                      }}
                    >
                      <CardContainer>{taskInfos}</CardContainer>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </Space>
        </Space>
      </DragDropContext>
      {taskFormVisible && (
        <TaskForm
          taskStepId={taskSteps[0].id}
          visible={taskFormVisible}
          updateInfo={taskUpdateInfo}
          onCancel={() => setTaskFormVisible(false)}
          afterAction={() => reloadDemandTasks()}
          executors={Object.keys(members).map((key) => members[key])}
          demandId={demand.id}
        />
      )}
    </>
  );
};
