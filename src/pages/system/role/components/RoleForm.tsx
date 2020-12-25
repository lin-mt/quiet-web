import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { saveRole, updateRole } from '@/services/system/QuietRole';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';

type RoleFormProps = {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  operationType?: OperationType;
  updateInfo?: SystemEntities.QuietRole;
  afterAction?: () => void;
};

const RoleForm: React.FC<RoleFormProps> = (props) => {
  const { visible, onCancel, operationType, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const nonsupportMsg = 'nonsupport FormType';

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    switch (operationType) {
      case OperationType.CREATE:
        await saveRole(values);
        break;
      case OperationType.UPDATE:
        await updateRole({ ...updateInfo, ...values });
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
        return '新建角色';
      case OperationType.UPDATE:
        return '更新角色';
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
      <Form form={form} name="roleForm" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Col>
          <Form.Item
            label="角色名"
            name="roleName"
            rules={[
              { required: true, message: '请输入角色名' },
              { max: 30, message: '角色名称长度不能超过 30' },
            ]}
          >
            <Input placeholder="请输入角色名" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="角色中文名"
            name="roleCnName"
            rules={[
              { required: true, message: '请输入角色中文名' },
              { max: 30, message: '角色中文名称长度不能超过 30' },
            ]}
          >
            <Input placeholder="请输入角色中文名" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="父角色 ID" name="parentId">
            <Input placeholder="请输入父角色 ID" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="备注"
            name="remark"
            rules={[{ max: 100, message: '角色的备注信息长度不能超过 100' }]}
          >
            <Input placeholder="请输入备注信息" />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default RoleForm;
