import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Typography } from '@arco-design/web-react';
import { QuietTeam } from '@/service/system/type';
import UserSelect from '@/components/UserSelect';
import { QuietFormProps } from '@/components/type';

const { useForm } = Form;

export type TeamFormProps = QuietFormProps<QuietTeam>;

function TeamForm(props: TeamFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(props.formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.formValues]);

  function handleOk() {
    if (props.onOk) {
      form.validate().then(async (values) => {
        values.product_owners = values.product_owners.map((u) => ({
          id: typeof u === 'string' ? u : u.id,
        }));
        values.scrum_masters = values.scrum_masters.map((u) => ({
          id: typeof u === 'string' ? u : u.id,
        }));
        values.members = values.members.map((u) => ({
          id: typeof u === 'string' ? u : u.id,
        }));
        setSubmitting(true);
        props.onOk(values).finally(() => {
          setSubmitting(false);
        });
      });
    }
  }

  function handleCancel() {
    if (props.onCancel) {
      props.onCancel();
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
        id={'team-form'}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
      >
        {props.formValues && (
          <>
            <Form.Item field="id" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item label="团队ID" field="id">
              <Typography.Text copyable>{props.formValues.id}</Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item
          label="团队名称"
          field="team_name"
          rules={[
            { required: true, message: '请输入团队名称' },
            { max: 8, message: '姓名的长度不能超过 8' },
          ]}
        >
          <Input placeholder="请输入团队名称" />
        </Form.Item>
        <Form.Item
          label="ProductOwners"
          field={'product_owners'}
          rules={[{ required: true, message: '请选择 Product Owner' }]}
          formatter={(value) => {
            return value?.map((u) => (typeof u === 'string' ? u : u.id));
          }}
        >
          <UserSelect mode={'multiple'} placeholder="请选择 Product Owner" />
        </Form.Item>
        <Form.Item
          label="ScrumMasters"
          field={'scrum_masters'}
          rules={[{ required: true, message: '请选择 Scrum Master' }]}
          formatter={(value) => {
            return value?.map((u) => (typeof u === 'string' ? u : u.id));
          }}
        >
          <UserSelect mode={'multiple'} placeholder="请选择 Scrum Master" />
        </Form.Item>
        <Form.Item
          label="团队成员"
          field={'members'}
          formatter={(value) => {
            return value?.map((u) => (typeof u === 'string' ? u : u.id));
          }}
        >
          <UserSelect mode={'multiple'} placeholder="请选择团队成员" />
        </Form.Item>
        <Form.Item
          label="团队标语"
          field="slogan"
          rules={[{ maxLength: 60, message: '团队标语长度不能超过 60' }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 2 }}
            placeholder="请输入团队标语"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TeamForm;
