import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { savePriority, updatePriority } from '@/services/scrum/ScrumPriority';
import type { ScrumPriority, ScrumTemplate } from '@/services/scrum/EntitiyType';

interface PriorityFormProps {
  visible: boolean;
  template: ScrumTemplate;
  onCancel: () => void;
  updateInfo?: ScrumPriority;
  afterAction?: () => void;
}

const PriorityForm: React.FC<PriorityFormProps> = (props) => {
  const { visible, onCancel, updateInfo, template, afterAction } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(updateInfo);
  }, [form, updateInfo]);

  const [submitting, setSubmitting] = useState<boolean>(false);
  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    values.templateId = template.id;
    if (!updateInfo) {
      values.serialNumber = template.priorities?.length;
      await savePriority(values);
    } else {
      await updatePriority({
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
      title={updateInfo ? '更新优先级信息' : '新建优先级选项'}
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
          label={'优先级名称'}
          name={'name'}
          rules={[
            { required: true, message: '请输入优先级名称' },
            { max: 10, message: '优先级名称长度不能超过 10' },
          ]}
        >
          <Input placeholder="请输入名称" />
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

export default PriorityForm;
