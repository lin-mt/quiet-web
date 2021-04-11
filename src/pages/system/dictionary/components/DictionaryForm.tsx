import type { BaseSyntheticEvent } from 'react';
import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { saveDictionary, updateDictionary } from '@/services/system/QuietDictionary';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';

type DictionaryFormProps = {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  operationType?: OperationType;
  updateInfo?: SystemEntities.QuietDictionary;
  afterAction?: () => void;
};

const DictionaryForm: React.FC<DictionaryFormProps> = (props) => {
  const { visible, onCancel, operationType, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [typeRequired, setTypeRequired] = useState<boolean>(true);
  const [keyRequired, setKeyRequired] = useState<boolean>(false);
  const [showTypeInput, setShowTypeInput] = useState<boolean>(true);
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const nonsupportMsg = 'nonsupport FormType';

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    switch (operationType) {
      case OperationType.CREATE:
        await saveDictionary(values);
        break;
      case OperationType.UPDATE:
        await updateDictionary({ ...updateInfo, ...values });
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

  function parentIdOnChange(e: BaseSyntheticEvent) {
    const { value } = e.target;
    const hasParentIdValue = value && value.length > 0;
    setShowKeyInput(hasParentIdValue);
    setKeyRequired(hasParentIdValue);
    setShowTypeInput(!hasParentIdValue);
    setTypeRequired(!hasParentIdValue);
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
      <Form form={form} name="dictionaryForm" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Col>
          <Form.Item
            label="label"
            name="label"
            rules={[
              { required: true, message: '请输入label' },
              { type: 'string', max: 30, message: 'label长度不能超过 30' },
            ]}
          >
            <Input placeholder="请输入label" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="父数据字典 ID" name="parentId">
            <Input placeholder="请输入父数据字典 ID" onChange={parentIdOnChange} />
          </Form.Item>
        </Col>
        <Col>
          {showTypeInput && (
            <Form.Item
              label="字典类型"
              name="type"
              rules={[
                { required: typeRequired, message: '请输入字典类型' },
                { max: 30, message: '字典类型长度不能超过 30' },
              ]}
            >
              <Input placeholder="请输入字典类型" />
            </Form.Item>
          )}
        </Col>
        <Col>
          {showKeyInput && (
            <Form.Item
              label="key"
              name="key"
              rules={[
                { required: keyRequired, message: '请输入key' },
                { type: 'string', max: 30, message: 'key长度不能超过 30' },
              ]}
            >
              <Input placeholder="请输入key" />
            </Form.Item>
          )}
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

export default DictionaryForm;
