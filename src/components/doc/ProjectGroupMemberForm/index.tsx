import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from '@arco-design/web-react';
import { DocProjectGroupMember, Permission } from '@/service/doc/type';
import UserSelect from '@/components/UserSelect';
import { enumToSelectOptions } from '@/utils/render';

const { useForm } = Form;

export type ProjectGroupMemberFormProps = {
  groupMember?: DocProjectGroupMember;
  groupId: string;
  title?: string;
  visible?: boolean;
  onOk?: (
    values: DocProjectGroupMember
  ) => Promise<DocProjectGroupMember | void>;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
};

function ProjectGroupMemberForm(props: ProjectGroupMemberFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    if (props.groupMember) {
      form.setFieldsValue(props.groupMember);
    }
  }, [form, props.groupMember]);

  function handleOk() {
    if (props.onOk) {
      form.validate().then(async (values) => {
        setSubmitting(true);
        values.group_id = props.groupId;
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
      style={{ width: 500 }}
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
        id={'project-group-member-form'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
      >
        {props.groupMember && (
          <>
            <Form.Item hidden={true} field="id">
              <Input />
            </Form.Item>
          </>
        )}
        <Form.Item
          label="成员"
          field="user_id"
          rules={[{ required: true, message: '请选择成员' }]}
        >
          <UserSelect placeholder="请输入用户名/姓名" />
        </Form.Item>
        <Form.Item
          label="权限"
          field="permission"
          rules={[{ required: true, message: '请选择成员权限' }]}
        >
          <Select
            options={enumToSelectOptions(Permission)}
            placeholder={'请选择成员权限'}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProjectGroupMemberForm;
