import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { saveDepartment, updateDepartment } from '@/services/system/QuietDepartment';
import type { QuietDepartment } from '@/services/system/EntityType';

type DepartmentFormProps = {
  visible: boolean;
  onCancel: () => void;
  updateInfo?: QuietDepartment;
  afterAction?: () => void;
};

const DepartmentForm: React.FC<DepartmentFormProps> = (props) => {
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
      await updateDepartment({ ...updateInfo, ...values });
    } else {
      await saveDepartment(values);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新部门信息';
    }
    return '新增部门信息';
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
