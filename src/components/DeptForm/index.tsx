import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Typography } from '@arco-design/web-react';
import { QuietDept } from '@/service/system/type';
import DeptTreeSelect from '@/components/DeptTreeSelect';
import { QuietFormProps } from '@/components/type';

const { useForm } = Form;

export type DeptFormProps = QuietFormProps<QuietDept>;

function DeptForm(props: DeptFormProps) {
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
        id={'role-form'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
      >
        {props.formValues && (
          <>
            <Form.Item hidden field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'部门ID'} field="id">
              <Typography.Text copyable>{props.formValues.id}</Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item
          label="部门名称"
          field="dept_name"
          rules={[
            { required: true, message: '请输入部门名称' },
            { max: 10, message: '部门名称长度不能超过 10' },
          ]}
        >
          <Input placeholder="请输入部门名称" />
        </Form.Item>
        <Form.Item label="父级部门" field="parent_id">
          <DeptTreeSelect multiple={false} placeholder="请选择父级部门" />
        </Form.Item>
        <Form.Item
          label="备注"
          field="remark"
          rules={[{ max: 100, message: '备注信息长度不能超过 100' }]}
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

export default DeptForm;
