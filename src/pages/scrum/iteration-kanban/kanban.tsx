import React from 'react';
import styles from '@/pages/scrum/iteration-kanban/style/index.module.less';
import { ScrumDemand, ScrumTask, ScrumTaskStep } from '@/service/scrum/type';
import DemandCard from '@/components/scrum/DemandCard';

const columnWidth = 320;
const columnMargin = 10;
const containerWidth = columnWidth + columnMargin * 2;
const rowHeight = 110;
const rowMarginTop = 3;
const rowPaddingTop = 5;
const kanbanTitleHeight = 38;

export type KanbanProps = {
  userId2fullName: Record<string, string>;
  taskTypeKey2name: Record<string, string>;
  demandTypeKey2name: Record<string, string>;
  taskStepId2info: Record<string, ScrumTaskStep>;
  priorityId2color: Record<string, string>;
  demandId2info: Record<string, ScrumDemand>;
  demandId2TaskStepTasks: Record<string, Record<string, ScrumTask[]>>;
};

function Kanban(props: KanbanProps) {
  const {
    userId2fullName,
    taskTypeKey2name,
    demandTypeKey2name,
    demandId2TaskStepTasks,
    taskStepId2info,
    demandId2info,
    priorityId2color,
  } = props;

  function getBackGroundHeight() {
    const demandIds = Object.keys(demandId2info);
    let max = demandIds.length;
    const taskStepId2TaskCount: Record<string, number> = {};
    demandIds.forEach((id) => {
      const tsId2tasks = demandId2TaskStepTasks[id];
      Object.keys(taskStepId2info).forEach((tsId) => {
        if (!taskStepId2TaskCount[tsId]) {
          taskStepId2TaskCount[tsId] = 0;
        }
        if (!tsId2tasks) {
          taskStepId2TaskCount[tsId] = taskStepId2TaskCount[tsId] + 1;
          return;
        }
        if (!tsId2tasks[tsId] || tsId2tasks[tsId]?.length == 0) {
          taskStepId2TaskCount[tsId] = taskStepId2TaskCount[tsId] + 1;
        } else {
          taskStepId2TaskCount[tsId] =
            taskStepId2TaskCount[tsId] + tsId2tasks[tsId].length;
        }
      });
    });
    Object.keys(taskStepId2TaskCount).forEach((tsId) => {
      max = Math.max(taskStepId2TaskCount[tsId], max);
    });
    return (
      max * (rowHeight + rowMarginTop + rowPaddingTop) +
      kanbanTitleHeight -
      rowMarginTop
    );
  }

  return (
    <div
      className={styles['container']}
      style={{ height: getBackGroundHeight() }}
    >
      {Object.keys(demandId2info).map((id, index) => {
        return (
          <div
            key={id}
            style={{
              width: (Object.keys(taskStepId2info).length + 1) * containerWidth,
              height: rowHeight,
              paddingTop: rowPaddingTop,
              marginTop: index === 0 ? kanbanTitleHeight : rowMarginTop,
              // backgroundColor: '#b7c9ea',
              // opacity: 0.6,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: columnWidth,
                marginLeft: columnMargin,
                marginRight: columnMargin,
              }}
            >
              <div
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <DemandCard
                  demand={demandId2info[id]}
                  typeKey2Name={demandTypeKey2name}
                  priorityId2Color={priorityId2color}
                />
                <div
                  style={{
                    float: 'right',
                    fontSize: 12,
                    cursor: 'pointer',
                    color: 'rgb(var(--primary-6))',
                    marginTop: 3,
                  }}
                >
                  + 创建任务
                </div>
              </div>
            </div>
            {Object.keys(taskStepId2info).map((tsId, tsIndex) => {
              return (
                <div
                  key={tsId}
                  style={{
                    position: 'absolute',
                    width: columnWidth,
                    height: rowHeight,
                    left: (tsIndex + 1) * containerWidth + columnMargin,
                    top:
                      index * (rowHeight + rowMarginTop + rowPaddingTop) +
                      kanbanTitleHeight +
                      rowPaddingTop,
                  }}
                >
                  <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                    {tsId}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div
        className={styles['kanban-background']}
        style={{
          width: (Object.keys(taskStepId2info).length + 1) * containerWidth,
        }}
      >
        <div
          style={{
            left: 0,
            width: columnWidth,
            marginLeft: columnMargin,
            marginRight: columnMargin,
          }}
          className={styles['demand-column']}
        />
        <h4 className={styles['kanban-title']} style={{ left: columnMargin }}>
          迭代需求
        </h4>
        {Object.keys(taskStepId2info).map((id, index) => {
          return (
            <div key={id}>
              <div
                style={{
                  left: (index + 1) * containerWidth,
                  width: columnWidth,
                  marginLeft: columnMargin,
                  marginRight: columnMargin,
                }}
                className={styles['task-step-column']}
              />
              <h4
                className={styles['kanban-title']}
                style={{ left: (index + 1) * containerWidth + columnMargin }}
              >
                {taskStepId2info[id].name}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Kanban;
