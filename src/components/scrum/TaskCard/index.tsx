import React, { CSSProperties, useState } from 'react';
import {
  Card,
  Grid,
  Popconfirm,
  Space,
  Typography,
} from '@arco-design/web-react';
import { ScrumTask } from '@/service/scrum/type';
import styled from 'styled-components';
import { IconDelete, IconEdit } from '@arco-design/web-react/icon';
import TaskForm, { TaskFormProps } from '@/components/scrum/TaskForm';
import { deleteTask, updateTask } from '@/service/scrum/task';

const { Row, Col } = Grid;

export type TaskCardProps = {
  task: ScrumTask;
  typeKey2Name: Record<string, string>;
  afterDelete?: () => void;
  afterUpdate?: (task: ScrumTask) => void;
  style?: CSSProperties;
};

const TaskStyleCard = styled(Card)<{ color: string }>`
  font-size: 12px;
  border-width: 1px 1px 1px 9px;
  border-style: solid;
  border-color: ${(props) => props.color};
  border-image: initial;
  border-radius: 3px;
  transition: box-shadow 0.3s, border-color 0.3s;
  &:hover {
    box-shadow: 0 1px 2px -2px rgb(var(--gray-6)),
      0 3px 6px 0 rgb(var(--gray-5)), 0 5px 12px 4px rgb(var(--gray-3));
  }
`;

const TaskOperation = styled.div<{ danger: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  transition: all 0.1s;
  &:hover {
    color: ${(props) =>
      props.danger ? 'rgb(var(--danger-6))' : 'rgb(var(--primary-6))'};
    background-color: rgb(var(--gray-3));
  }
`;

function TaskCard(props: TaskCardProps) {
  const [task, setTask] = useState<ScrumTask>(props.task);
  const [taskFormProps, setTaskFormProps] = useState<TaskFormProps>();

  function handleEditDemand() {
    setTaskFormProps({
      visible: true,
      title: '编辑任务',
      formValues: task,
      onOk: (values) => {
        return updateTask(values).then((resp) => {
          if (props.afterUpdate) {
            props.afterUpdate(resp);
          }
          setTask(resp);
          setTaskFormProps({ visible: false });
        });
      },
      onCancel: () => setTaskFormProps({ visible: false }),
    });
  }

  return (
    <TaskStyleCard
      size={'small'}
      style={props.style}
      bodyStyle={{ padding: 7 }}
    >
      <Space direction={'vertical'} size={3} style={{ width: '100%' }}>
        <Row>
          <Col flex={'auto'}>
            <Typography.Title
              copyable
              heading={6}
              style={{ marginBottom: 0, fontSize: 14 }}
              ellipsis={{ rows: 1, showTooltip: true }}
            >
              {task.title}
            </Typography.Title>
          </Col>
          <Col flex={'39px'}>
            <Space style={{ lineHeight: 1.5, fontSize: 14 }}>
              <TaskOperation onClick={handleEditDemand}>
                <IconEdit />
              </TaskOperation>
              <Popconfirm
                title={'确认删除该任务吗？'}
                onOk={() => {
                  deleteTask(task.id).then(() => {
                    if (props.afterDelete) {
                      props.afterDelete();
                    }
                  });
                }}
              >
                <TaskOperation danger>
                  <IconDelete />
                </TaskOperation>
              </Popconfirm>
            </Space>
          </Col>
        </Row>
        <Typography.Text>
          类型：
          {props.typeKey2Name[task.type]}
        </Typography.Text>
        <Typography.Text
          ellipsis={{ rows: 1, showTooltip: true }}
          style={{ marginBottom: 4 }}
        >
          备注：{task.remark}
        </Typography.Text>
      </Space>
      <TaskForm {...taskFormProps} />
    </TaskStyleCard>
  );
}

export default TaskCard;
