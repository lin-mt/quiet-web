import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { saveDataDictionary, updateDataDictionary } from '@/services/system/QuietDataDictionary';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';

type DataDictionaryFormProps = {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  operationType?: OperationType;
  updateInfo?: SystemEntities.QuietDataDictionary;
  afterAction?: () => void;
};

const DataDictionaryForm: React.FC<DataDictionaryFormProps> = (props) => {
  const { visible, onCancel, operationType, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const nonsupportMsg = 'nonsupport FormType';

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    switch (operationType) {
      case OperationType.CREATE:
        await saveDataDictionary(values);
        break;
      case OperationType.UPDATE:
        await updateDataDictionary({ ...updateInfo, ...values });
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
        return '新建数据字典';
      case OperationType.UPDATE:
        return '更新数据字典';
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
      <Form form={form} name="dataDictionaryForm" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Col>
          <Form.Item
            label="字典类型"
            name="type"
            rules={[
              { required: true, message: '请输入字典类型' },
              { max: 30, message: '字典类型长度不能超过 30' },
            ]}
          >
            <Input placeholder="请输入字典类型" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="key"
            name="key"
            rules={[
              { required: true, message: '请输入key' },
              { max: 30, message: 'key长度不能超过 30' },
            ]}
          >
            <Input placeholder="请输入key" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="value"
            name="value"
            rules={[
              { required: true, message: '请输入value' },
              { max: 30, message: 'value长度不能超过 30' },
            ]}
          >
            <Input placeholder="请输入key" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="父数据字典 ID" name="parentId">
            <Input placeholder="请输入父数据字典 ID" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="备注"
            name="remark"
            rules={[{ max: 100, message: '数据字典的备注信息长度不能超过 100' }]}
          >
            <Input placeholder="请输入备注信息" />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default DataDictionaryForm;
