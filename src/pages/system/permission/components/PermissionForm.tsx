import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { savePermission, updatePermission } from '@/services/system/QuietPermission';
import type { QuietPermission } from '@/services/system/EntityType';

type PermissionFormProps = {
  visible: boolean;
  onCancel: () => void;
  updateInfo?: QuietPermission;
  afterAction?: () => void;
};

const RoleForm: React.FC<PermissionFormProps> = (props) => {
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
      await updatePermission({ ...updateInfo, ...values });
    } else {
      await savePermission(values);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新';
    }
    return '保存';
  }

  function getSubmitButtonName() {
    if (updateInfo) {
      return '更新配置';
    }
    return '保存配置';
  }

  function handleModalCancel() {
    form.setFieldsValue(undefined);
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
