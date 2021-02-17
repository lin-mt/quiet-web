import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { savePermission, updatePermission } from '@/services/system/QuietPermission';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';

type PermissionFormProps = {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  operationType?: OperationType;
  updateInfo?: SystemEntities.QuietPermission;
  afterAction?: () => void;
};

const RoleForm: React.FC<PermissionFormProps> = (props) => {
  const { visible, onCancel, operationType, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const nonsupportMsg = 'nonsupport FormType';

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    switch (operationType) {
      case OperationType.CREATE:
        await savePermission(values);
        break;
      case OperationType.UPDATE:
        await updatePermission({ ...updateInfo, ...values });
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
        return '保存';
      case OperationType.UPDATE:
        return '更新';
      default:
        throw Error(nonsupportMsg);
    }
  }

  function getSubmitButtonName() {
    switch (operationType) {
      case OperationType.CREATE:
        return '保存配置';
      case OperationType.UPDATE:
        return '更新配置';
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
        <Button key="cancel" onClick={() => handleModalCancel()}>
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
      <Form form={form} name="permissionForm" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Col>
          <Form.Item
            label="应用名称"
            name="applicationName"
            rules={[{ required: true, message: '请输入应用名称' }]}
          >
            <Input placeholder="请输入应用名称" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="urlPattern"
            name="urlPattern"
            rules={[
              { required: true, message: '请输入urlPattern' },
              { max: 100, message: 'url匹配规则长度不能超过 100' },
            ]}
          >
            <Input placeholder="请输入urlPattern" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="requestMethod" name="requestMethod">
            <Input placeholder="请输入请求方法" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="角色 ID"
            name="roleId"
            rules={[{ required: true, message: '请输入角色ID' }]}
          >
            <Input placeholder="请输入角色 ID" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="备注"
            name="remark"
            rules={[{ max: 100, message: '权限的备注信息长度不能超过 100' }]}
          >
            <Input placeholder="请输入备注信息" />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default RoleForm;
