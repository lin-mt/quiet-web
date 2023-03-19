import React, { CSSProperties, useState } from 'react';
import {
  Card,
  Grid,
  Popconfirm,
  Space,
  Typography,
} from '@arco-design/web-react';
import { ScrumTask } from '@/service/scrum/type';
import { IconDelete, IconEdit } from '@arco-design/web-react/icon';
import TaskForm, { TaskFormProps } from '@/components/scrum/TaskForm';
import { deleteTask, updateTask } from '@/service/scrum/task';
import styles from '@/components/scrum/TaskCard/style/index.module.less';

const { Row, Col } = Grid;

export type TaskCardProps = {
  task: ScrumTask;
  typeKey2name: Record<string, string>;
  userId2fullName: Record<string, string>;
  afterDelete?: () => void;
  afterUpdate?: (task: ScrumTask) => void;
  style?: CSSProperties;
};

function TaskCard(props: TaskCardProps) {
  const [task, setTask] = useState<ScrumTask>(props.task);
  const [taskFormProps, setTaskFormProps] = useState<TaskFormProps>();

  function handleEditDemand() {
    setTaskFormProps({
      visible: true,
      title: '编辑任务',
      formValues: task,
      userOptions: Object.keys(props.userId2fullName).map((id) => ({
        value: id,
        label: props.userId2fullName[id],
      })),
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
    <Card
      size={'small'}
      style={props.style}
      bodyStyle={{ padding: 7 }}
      className={styles['task-card']}
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
              <div className={styles['task-option']} onClick={handleEditDemand}>
                <IconEdit />
              </div>
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
                <div className={styles['task-option-danger']}>
                  <IconDelete />
                </div>
              </Popconfirm>
            </Space>
          </Col>
        </Row>
        <Typography.Text>
          类型：
          {props.typeKey2name[task.type]}
        </Typography.Text>
        <Typography.Text
          ellipsis={{ rows: 1, showTooltip: true }}
          style={{ marginBottom: 4 }}
        >
          执行者：{props.userId2fullName[task.executor_id]}
        </Typography.Text>
      </Space>
      <TaskForm {...taskFormProps} />
    </Card>
  );
}

export default TaskCard;
