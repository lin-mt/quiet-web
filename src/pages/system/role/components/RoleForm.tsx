import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { saveRole, updateRole } from '@/services/system/QuietRole';
import type { QuietRole } from '@/services/system/EntityType';

type RoleFormProps = {
  visible: boolean;
  onCancel: () => void;
  updateInfo?: QuietRole;
  afterAction?: () => void;
};

const RoleForm: React.FC<RoleFormProps> = (props) => {
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
      await updateRole({ ...updateInfo, ...values });
    } else {
      await saveRole(values);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新角色';
    }
    return '新建角色';
  }

  function getSubmitButtonName() {
    if (updateInfo) {
      return '更新';
    }
    return '保存';
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
      <Form form={form} name="roleForm" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Col>
          <Form.Item
            label="角色名"
            name="role_name"
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
            name="role_cn_name"
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
