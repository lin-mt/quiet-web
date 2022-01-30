import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { saveTaskStep, updateTaskStep } from '@/services/scrum/ScrumTaskStep';
import type { ScrumTaskStep, ScrumTemplate } from '@/services/scrum/EntitiyType';

interface TaskStepFormProps {
  visible: boolean;
  template: ScrumTemplate;
  onCancel: () => void;
  updateInfo?: ScrumTaskStep;
  afterAction?: () => void;
}

const TaskStepForm: React.FC<TaskStepFormProps> = (props) => {
  const { visible, onCancel, updateInfo, template, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(updateInfo);
  }, [form, updateInfo]);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    values.template_id = template.id;
    if (!updateInfo) {
      values.serial_number = template.task_steps?.length;
      await saveTaskStep(values);
    } else {
      await updateTaskStep({
        ...updateInfo,
        ...values,
      });
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function handleModalCancel() {
    form.setFieldsValue(undefined);
    onCancel();
  }

  return (
    <Modal
      destroyOnClose
      width={500}
      title={updateInfo ? '更新任务步骤' : '新建任务步骤'}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={[
        <Button key={'cancel'} onClick={() => handleModalCancel()}>
          取消
        </Button>,
        <Button
          loading={submitting}
          key={'submit'}
          type={'primary'}
          htmlType={'submit'}
          onClick={handleSubmit}
        >
          {updateInfo ? '更新' : '保存'}
        </Button>,
      ]}
    >
      <Form form={form} name={'taskStepForm'} labelCol={{ span: 5 }}>
        <Form.Item
          label={'步骤名称'}
          name={'name'}
          rules={[
            { required: true, message: '请输入步骤名称' },
            { max: 10, message: '步骤名称长度不能超过 10' },
          ]}
        >
          <Input placeholder="请输入步骤名称" />
        </Form.Item>
        <Form.Item
          label={'备注信息'}
          name={'remark'}
          rules={[{ max: 30, message: '备注信息长度不能超过 30' }]}
        >
          <Input.TextArea placeholder="请输入备注信息" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskStepForm;
