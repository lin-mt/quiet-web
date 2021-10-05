import type { BaseSyntheticEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { saveDictionary, updateDictionary } from '@/services/system/QuietDictionary';
import type { QuietDictionary } from '@/services/system/EntityType';

type DictionaryFormProps = {
  visible: boolean;
  onCancel: () => void;
  updateInfo?: QuietDictionary;
  afterAction?: () => void;
};

const DictionaryForm: React.FC<DictionaryFormProps> = (props) => {
  const { visible, onCancel, updateInfo, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [typeRequired, setTypeRequired] = useState<boolean>(!updateInfo || !updateInfo.parent_id);
  const [keyRequired, setKeyRequired] = useState<boolean>(!!updateInfo && !!updateInfo.parent_id);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(updateInfo);
  }, [form, updateInfo]);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    if (updateInfo) {
      await updateDictionary({ ...updateInfo, ...values });
    } else {
      await saveDictionary(values);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新数据字典';
    }
    return '新建数据字典';
  }

  function getSubmitButtonName() {
    if (updateInfo) {
      return '更新';
    }
    return '保存';
  }

  function handleModalCancel() {
    form.resetFields();
    onCancel();
  }

  function parentIdOnChange(e: BaseSyntheticEvent) {
    const { value } = e.target;
    const hasParentIdValue = value && value.length > 0;
    setKeyRequired(hasParentIdValue);
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
          <Form.Item label="父数据字典 ID" name="parent_id">
            <Input placeholder="请输入父数据字典 ID" onChange={parentIdOnChange} />
          </Form.Item>
        </Col>
        <Col>
          {typeRequired && (
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
          {keyRequired && (
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
