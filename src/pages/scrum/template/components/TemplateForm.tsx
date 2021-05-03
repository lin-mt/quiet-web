import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { saveTemplate, updateTemplate } from '@/services/scrum/ScrumTemplate';
import type { ScrumTemplate } from '@/services/scrum/EntitiyType';

interface TemplateFormProps {
  visible: boolean;
  onCancel: () => void;
  updateInfo?: ScrumTemplate;
  afterAction?: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = (props) => {
  const { visible, onCancel, updateInfo, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(updateInfo);
  }, [form, updateInfo]);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    if (updateInfo) {
      await updateTemplate({
        ...updateInfo,
        ...values,
      });
    } else {
      await saveTemplate(values);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新模板';
    }
    return '新建模板';
  }

  function getSubmitButtonName() {
    if (updateInfo) {
      return '更新';
    }
    return '创建';
  }

  function handleModalCancel() {
    form.setFieldsValue(undefined);
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
