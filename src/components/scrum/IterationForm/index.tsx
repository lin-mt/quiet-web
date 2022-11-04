import React, { useEffect, useState } from 'react';
import {
  DatePicker,
  Form,
  Input,
  Modal,
  Typography,
} from '@arco-design/web-react';
import { QuietFormProps } from '@/components/type';
import { ScrumIteration } from '@/service/scrum/type';

const { useForm } = Form;

export type IterationFormProps = QuietFormProps<ScrumIteration> & {
  versionId: string;
};

function VersionForm(props: IterationFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    if (props.formValues) {
      form.setFieldsValue(props.formValues);
      form.setFieldValue('plan_date', [
        props.formValues.plan_start_date,
        props.formValues.plan_end_date,
      ]);
    } else {
      form.setFieldsValue(undefined);
    }
  }, [form, props.formValues]);

  function handleOk() {
    if (props.onOk) {
      form.validate().then(async (values) => {
        values.plan_start_date = values.plan_date[0];
        values.plan_end_date = values.plan_date[1];
        if (!values.version_id && props.versionId) {
          values.version_id = props.versionId;
        }
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
        id={'scrum-iteration-form'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
      >
        {props.formValues && (
          <>
            <Form.Item hidden field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'迭代ID'} field="id">
              <Typography.Text copyable>{props.formValues.id}</Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item hidden field="version_id">
          <Input />
        </Form.Item>
        <Form.Item
          label="名称"
          field="name"
          rules={[
            { required: true, message: '请输入迭代名称' },
            { maxLength: 30, message: '迭代名称长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入版本名称" />
        </Form.Item>
        <Form.Item
          label="计划日期"
          field="plan_date"
          rules={[{ required: true, message: '请选择计划日期' }]}
        >
          <DatePicker.RangePicker
            placeholder={['请选择计划开始日期', '请选择计划结束日期']}
          />
        </Form.Item>
        <Form.Item
          label="备注"
          field="remark"
          rules={[{ maxLength: 1000, message: '备注信息长度不能超过 1000' }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2 }}
            placeholder="请输入备注信息"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default VersionForm;
