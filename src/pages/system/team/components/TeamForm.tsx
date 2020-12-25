import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { saveTeam, updateTeam } from '@/services/system/QuietTeam';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';

type TeamFormProps = {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  operationType?: OperationType;
  updateInfo?: SystemEntities.QuietTeam;
  afterAction?: () => void;
};

const RoleForm: React.FC<TeamFormProps> = (props) => {
  const { visible, onCancel, operationType, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const nonsupportMsg = 'nonsupport FormType';

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    switch (operationType) {
      case OperationType.CREATE:
        await saveTeam(values);
        break;
      case OperationType.UPDATE:
        await updateTeam({ ...updateInfo, ...values });
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
        return '新建团队';
      case OperationType.UPDATE:
        return '更新团队';
      default:
        throw Error(nonsupportMsg);
    }
  }

  function getSubmitButtonName() {
    switch (operationType) {
      case OperationType.CREATE:
        return '保存';
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
      width={600}
      title={getTitle()}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={[
        <Button key="back" onClick={() => handleModalCancel()}>
          取消
        </Button>,
        <Button
          loading={submitting}
          key="submit"
          type="primary"
          htmlType="submit"
          onClick={handleSubmit}
        >
          {getSubmitButtonName()}
        </Button>,
      ]}
    >
      <Form form={form} name="teamForm" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Col>
          <Form.Item
            label="团队名称"
            name="teamName"
            rules={[
              { required: true, message: '请输入团队名称' },
              { max: 16, message: '团队名称长度不能超过 16' },
            ]}
          >
            <Input placeholder="请输入团队名称" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="标语"
            name="slogan"
            rules={[{ max: 30, message: '团队标语的长度不能超过 30' }]}
          >
            <Input placeholder="请输入团队标语" />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default RoleForm;
