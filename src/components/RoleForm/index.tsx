import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Typography } from '@arco-design/web-react';
import { QuietRole } from '@/service/system/type';
import RoleTreeSelect from '@/components/RoleTreeSelect';

const { useForm } = Form;

export type RoleFormProps = {
  roleInfo?: QuietRole;
  title?: string;
  visible?: boolean;
  onOk?: (values: QuietRole) => Promise<QuietRole | void>;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
};

function RoleForm(props: RoleFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    if (props.roleInfo) {
      form.setFieldsValue(props.roleInfo);
      form.setFieldValue('role_name', props.roleInfo.role_name.substring(5));
    }
  }, [form, props.roleInfo]);

  function handleOk() {
    if (props.onOk) {
      form.validate().then(async (values) => {
        setSubmitting(true);
        values.role_name = 'ROLE_' + values.role_name;
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
        {props.roleInfo && (
          <>
            <Form.Item hidden={true} field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'角色ID'} field="id">
              <Typography.Text copyable={true}>
                {props.roleInfo.id}
              </Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item
          label="角色名"
          field="role_name"
          rules={[
            { required: true, message: '请输入角色名' },
            { max: 30, message: '角色名称长度不能超过 30' },
          ]}
        >
          <Input addBefore="ROLE_" placeholder="请输入角色名" />
        </Form.Item>
        <Form.Item
          label="角色中文名"
          field="role_cn_name"
          rules={[
            { required: true, message: '请输入角色中文名' },
            { max: 30, message: '角色中文名称长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入角色中文名" />
        </Form.Item>
        <Form.Item label="父角色" field="parent_id">
          <RoleTreeSelect multiple={false} placeholder="请选择父角色" />
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

export default RoleForm;
