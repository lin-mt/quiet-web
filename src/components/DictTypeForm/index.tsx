import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Switch, Typography } from '@arco-design/web-react';
import { QuietDictType } from '@/service/system/type';
import { enabled } from '@/utils/render';
import { QuietFormProps } from '@/components/type';

const { useForm } = Form;

export type DictTypeFormProps = QuietFormProps<QuietDictType>;

function DictTypeForm(props: DictTypeFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(props.formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.formValues)]);

  function handleOk() {
    if (props.onOk) {
      form.validate().then(async (values) => {
        setSubmitting(true);
        props.onOk(values).finally(() => {
          setSubmitting(false);
        });
      });
    } else {
      form.resetFields();
    }
  }

  function handleCancel() {
    if (props.onCancel) {
      props.onCancel();
    } else {
      form.resetFields();
    }
  }

  return (
    <Modal
      style={{ width: 700 }}
      title={props.title}
      visible={props.visible}
      onOk={handleOk}
      okText={props.okText}
      onCancel={handleCancel}
      cancelText={props.cancelText}
      afterClose={() => {
        form.resetFields();
      }}
      confirmLoading={submitting}
    >
      <Form
        form={form}
        id={'dict-type-form'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
      >
        {props.formValues && (
          <>
            <Form.Item hidden field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'字典类型ID'} field="id">
              <Typography.Text copyable>{props.formValues.id}</Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item
          label="服务ID"
          field="service_id"
          rules={[
            { required: true, message: '请输入服务ID' },
            { max: 30, message: '服务ID长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="Key"
          field="key"
          rules={[
            { required: true, message: '请输入 key' },
            { max: 30, message: 'key 长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入 key" />
        </Form.Item>
        <Form.Item
          label="名称"
          field="name"
          rules={[
            { required: true, message: '请输入名称' },
            { max: 10, message: '名称长度不能超过 10' },
          ]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item
          label="启用状态"
          field="enabled"
          initialValue={true}
          triggerPropName="checked"
        >
          <Switch checkedText={enabled(true)} uncheckedText={enabled(false)} />
        </Form.Item>
        <Form.Item
          label="备注"
          field="remark"
          rules={[{ max: 100, message: '角色的备注信息长度不能超过 100' }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 5 }}
            placeholder="请输入备注信息"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default DictTypeForm;
