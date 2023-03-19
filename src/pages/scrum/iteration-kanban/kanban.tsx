import React from 'react';
import { ScrumDemand, ScrumTask, ScrumTaskStep } from '@/service/scrum/type';
import { Grid } from '@arco-design/web-react';
import KanbanRow, { MoveTask } from '@/pages/scrum/iteration-kanban/kanban-row';
import styles from '@/pages/scrum/iteration-kanban/style/index.module.less';

const { Row, Col } = Grid;

const columnWidth = 300;
const columnGutter = 10;
const columnRadius = 4;
const columnDefaultBc = 'var(--color-fill-2)';

export type KanbanRowProps = {
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
  handleMoveTask: (param: MoveTask) => void;
};

function Kanban(props: KanbanRowProps) {
  const {
    isDropDisabled,
    userId2fullName,
    taskTypeKey2name,
    demandTypeKey2name,
    demandId2TaskStepTasks,
    taskStepId2info,
    demandId2info,
    priorityId2color,
    handleNewTask,
    handleDeleteTask,
    handleMoveTask,
  } = props;

  const rowWidth =
    (Object.keys(taskStepId2info).length + 1) * (columnWidth + columnGutter) -
    columnGutter;

  return (
    <div className={styles['container']}>
      <div style={{ width: rowWidth }}>
        <Row gutter={columnGutter}>
          <Col flex={1}>
            <div
              style={{
                width: columnWidth,
                backgroundColor: columnDefaultBc,
                borderStartStartRadius: columnRadius,
                borderStartEndRadius: columnRadius,
              }}
            >
              <h4 className={styles['column-title']}>迭代需求</h4>
            </div>
          </Col>
          {Object.keys(taskStepId2info).map((id) => {
            return (
              <Col flex={1} key={id}>
                <div
                  style={{
                    width: columnWidth,
                    backgroundColor: columnDefaultBc,
                    borderStartStartRadius: columnRadius,
                    borderStartEndRadius: columnRadius,
                  }}
                >
                  <h4 className={styles['column-title']}>
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
          Object.keys(demandId2info).length === index + 1 ? columnRadius : 0;
        return (
          <KanbanRow
            key={demandId}
            demandId={demandId}
            isDropDisabled={isDropDisabled}
            handleNewTask={handleNewTask}
            handleDeleteTask={handleDeleteTask}
            blockRadius={blockRadius}
            columnDefaultBc={columnDefaultBc}
            demandTypeKey2name={demandTypeKey2name}
            taskTypeKey2name={taskTypeKey2name}
            rowWidth={rowWidth}
            priorityId2color={priorityId2color}
            taskStepId2info={taskStepId2info}
            demandId2TaskStepTasks={demandId2TaskStepTasks}
            columnGutter={columnGutter}
            demandId2info={demandId2info}
            userId2fullName={userId2fullName}
            handleMoveTask={handleMoveTask}
          />
        );
      })}
    </div>
  );
}

export default Kanban;
