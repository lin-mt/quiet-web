import React, { useEffect, useState } from 'react';
import { QuietFormProps } from '@/components/type';
import { ScrumTask } from '@/service/scrum/type';
import { Form, Input, Modal, Typography } from '@arco-design/web-react';
import DictSelect from '@/components/DictSelect';
import UserSelect from '@/components/UserSelect';

const { useForm } = Form;

export type TaskFormProps = QuietFormProps<ScrumTask> & {
  demandId?: string;
  taskStepId?: string;
  userOptions?: { label: string; value: string }[];
};

function TaskForm(props: TaskFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(props.formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.formValues)]);

  function handleOk() {
    if (props.onOk) {
      form.validate().then(async (values) => {
        if (props.demandId) {
          values.demand_id = props.demandId;
        }
        if (props.taskStepId) {
          values.task_step_id = props.taskStepId;
        }
        setSubmitting(true);
        props.onOk(values).finally(() => {
          setSubmitting(false);
        });
      });
    } else {
      form.resetFields();
    }
  }

  function handleCancel() {
    if (props.onCancel) {
      props.onCancel();
    } else {
      form.resetFields();
    }
  }

  return (
    <Modal
      style={{ width: 700 }}
      title={props.title}
      visible={props.visible}
      onOk={handleOk}
      okText={props.okText}
      onCancel={handleCancel}
      cancelText={props.cancelText}
      afterClose={() => {
        form.resetFields();
      }}
      confirmLoading={submitting}
    >
      <Form
        form={form}
        id={'scrum-task-form'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
      >
        {props.formValues && (
          <>
            <Form.Item hidden field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'任务ID'} field="id">
              <Typography.Text copyable>{props.formValues.id}</Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item hidden field="demand_id">
          <Input />
        </Form.Item>
        <Form.Item hidden field="task_step_id">
          <Input />
        </Form.Item>
        <Form.Item
          label="标题"
          field="title"
          rules={[
            { required: true, message: '请输入任务标题' },
            { maxLength: 10, message: '任务标题长度不能超过 10' },
          ]}
        >
          <Input placeholder="请输入任务标题" />
        </Form.Item>
        <Form.Item
          label="任务类型"
          field="type"
          rules={[{ required: true, message: '请选择任务类型' }]}
        >
          <DictSelect
            serviceId={'quiet-scrum'}
            typeKey={'task-type'}
            placeholder={'请选择任务类型'}
          />
        </Form.Item>
        <Form.Item
          label="执行者"
          field="executor_id"
          rules={[{ required: true, message: '请选择执行者' }]}
        >
          <UserSelect
            showSearch={false}
            options={props.userOptions}
            placeholder={'请选择执行者'}
          />
        </Form.Item>
        <Form.Item
          label="备注"
          field="remark"
          rules={[{ maxLength: 3000, message: '备注信息长度不能超过 3000' }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2 }}
            placeholder="请输入备注信息"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TaskForm;
