import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { saveDepartment, updateDepartment } from '@/services/system/QuiteDepartment';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';

type DepartmentFormProps = {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  operationType?: OperationType;
  updateInfo?: SystemEntities.QuiteDepartment;
  afterAction?: () => void;
};

const DepartmentForm: React.FC<DepartmentFormProps> = (props) => {
  const { visible, onCancel, operationType, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const nonsupportMsg = 'nonsupport FormType';

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    switch (operationType) {
      case OperationType.CREATE:
        await saveDepartment(values);
        break;
      case OperationType.UPDATE:
        await updateDepartment({ ...updateInfo, ...values });
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
        return '新增部门信息';
      case OperationType.UPDATE:
        return '更新部门信息';
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
      <Form form={form} name="departmentForm" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Col>
          <Form.Item
            label="部门名称"
            name="departmentName"
            rules={[
              { required: true, message: '请输入部门名称' },
              { max: 10, message: '部门名称长度不能超过 10' },
            ]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="父级部门 ID" name="parentId">
            <Input placeholder="请输入父级部门 ID" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="备注"
            name="remark"
            rules={[{ max: 100, message: '部门备注信息长度不能超过 100' }]}
          >
            <Input placeholder="请输入备注信息" />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default DepartmentForm;
