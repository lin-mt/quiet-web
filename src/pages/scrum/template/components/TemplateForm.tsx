import React, { useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { saveTemplate, updateTemplate } from '@/services/scrum/ScrumTemplate';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';

type TemplateFormProps = {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  operationType?: OperationType;
  updateInfo?: ScrumEntities.ScrumTemplate;
  afterAction?: () => void;
};

const TemplateForm: React.FC<TemplateFormProps> = (props) => {
  const nonsupportMsg = 'nonsupport FormType';

  const { visible, onCancel, operationType, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    switch (operationType) {
      case OperationType.CREATE:
        await saveTemplate(values);
        break;
      case OperationType.UPDATE:
        await updateTemplate({
          ...updateInfo,
          ...values,
        });
        break;
      default:
        throw Error(nonsupportMsg);
    }
    form.resetFields();
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    switch (operationType) {
      case OperationType.CREATE:
        return '新建模板';
      case OperationType.UPDATE:
        return '更新模板';
      default:
        throw Error(nonsupportMsg);
    }
  }

  function getSubmitButtonName() {
    switch (operationType) {
      case OperationType.CREATE:
        return '创建';
      case OperationType.UPDATE:
        return '更新';
      default:
        throw Error(nonsupportMsg);
    }
  }

  function handleModalCancel() {
    form.resetFields();
    onCancel();
  }

  return (
    <Modal
      destroyOnClose
      width={500}
      title={getTitle()}
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
          {getSubmitButtonName()}
        </Button>,
      ]}
    >
      <Form form={form} name={'projectForm'} labelCol={{ span: 5 }}>
        <Form.Item
          label={'模板名称'}
          name={'name'}
          rules={[
            { required: true, message: '请输入模板名称' },
            { max: 10, message: '模板名称长度不能超过 10' },
          ]}
        >
          <Input placeholder={'请输入模板名称'} />
        </Form.Item>
        <Form.Item
          label={'模板备注'}
          name={'remark'}
          rules={[{ max: 30, message: '备注信息长度不能超过 30' }]}
        >
          <Input.TextArea placeholder="请输入备注信息" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemplateForm;
