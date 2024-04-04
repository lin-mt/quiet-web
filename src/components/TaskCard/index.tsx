import { deleteTask, updateTask } from '@/services/quiet/taskController';
import { ApiMethod, idName, idUsername } from '@/util/Utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormItem,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Card, Flex, Form, Popconfirm, Typography } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import styles from './index.less';

const { Text, Title } = Typography;

type TaskCardProps = {
  style?: CSSProperties;
  projectDetail: API.ProjectDetail;
  template: API.TemplateDetail;
  task: API.TaskVO;
  afterDelete?: () => void;
  afterUpdate?: (newReq: API.TaskVO) => void;
};

function TaskCard(props: TaskCardProps) {
  const [updateForm] = Form.useForm();

  const { projectDetail, template } = props;
  const updateTaskTypeId = Form.useWatch('typeId', updateForm);
  const [isBackendApi, setIsBackendApi] = useState<boolean>(false);

  const [task, setTask] = useState<API.TaskVO>(props.task);

  useEffect(() => {
    if (!updateTaskTypeId) {
      setIsBackendApi(false);
    } else {
      const taskType = template.taskTypes.find((t) => t.id === updateTaskTypeId);
      setIsBackendApi(!!taskType?.backendApi);
    }
  }, [updateTaskTypeId]);

  useEffect(() => {
    setTask(props.task);
  }, [props.task]);

  return (
    <Card
      hoverable
      size="small"
      className={styles.taskCard}
      styles={{
        body: {
          padding: 6,
          height: 80,
        },
      }}
      style={{
        borderColor: '#8c8c8c',
        ...props.style,
      }}
    >
      <Flex vertical gap={2}>
        <Flex justify="space-between" align="center">
          <Title
            level={5}
            style={{ margin: 0, fontSize: 13, fontWeight: 500 }}
            ellipsis={{ tooltip: task.title }}
          >
            {task.title}
          </Title>
          <div>
            <ModalForm<API.UpdateTask>
              key={'update'}
              form={updateForm}
              title={'更新任务'}
              layout={'horizontal'}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              submitter={{
                render: (_, defaultDom) => {
                  return [
                    <Button
                      key="reset"
                      onClick={() => {
                        updateForm.resetFields();
                      }}
                    >
                      重置
                    </Button>,
                    ...defaultDom,
                  ];
                },
              }}
              trigger={
                <Button
                  size="small"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => updateForm.setFieldsValue({ ...task })}
                />
              }
              onFinish={async (values) => {
                const newTask = { ...task, ...values };
                await updateTask(newTask).then(() => {
                  if (props.afterUpdate) {
                    props.afterUpdate(newTask);
                  }
                });
                updateForm.setFieldsValue(values);
                setTask(newTask);
                return true;
              }}
            >
              <ProFormText name={'title'} label={'标题'} rules={[{ required: true, max: 30 }]} />
              <ProFormSelect
                name={'typeId'}
                label={'类型'}
                rules={[{ required: true }]}
                options={template.taskTypes}
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
                options={projectDetail.members}
                fieldProps={{ fieldNames: idUsername }}
              />
              <ProFormSelect
                name={'handlerId'}
                label={'处理人'}
                rules={[{ required: true }]}
                options={projectDetail.members}
                fieldProps={{ fieldNames: idUsername }}
              />
              <ProFormTextArea name={'description'} label={'描述'} rules={[{ max: 255 }]} />
            </ModalForm>
            <Popconfirm
              title={'确定删除该任务吗'}
              onConfirm={() => {
                deleteTask({ id: task.id }).then(() => {
                  if (props.afterDelete) {
                    props.afterDelete();
                  }
                });
              }}
            >
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        </Flex>
        <Text style={{ fontSize: 12 }}>
          类型：{template.taskTypes.find((t) => t.id === task.typeId)?.name}
        </Text>
        <Text style={{ fontSize: 12 }} ellipsis={{ tooltip: task.description }}>
          描述：{task.description || '-'}
        </Text>
      </Flex>
    </Card>
  );
}

export default TaskCard;
