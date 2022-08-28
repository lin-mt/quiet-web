import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Typography } from '@arco-design/web-react';
import { QuietTeam } from '@/service/system/type';
import UserSelect from '@/components/UserSelect';

const { useForm } = Form;

export type TeamFormProps = {
  teamInfo?: QuietTeam;
  title?: string;
  visible?: boolean;
  onOk?: (values: QuietTeam) => Promise<QuietTeam | void>;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
};

function TeamForm(props: TeamFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    if (props.teamInfo) {
      form.setFieldsValue(props.teamInfo);
      form.setFieldValue(
        'product_owners',
        props.teamInfo.product_owners?.map((po) => po.id)
      );
      form.setFieldValue(
        'scrum_masters',
        props.teamInfo.scrum_masters?.map((po) => po.id)
      );
      form.setFieldValue(
        'members',
        props.teamInfo.members?.map((po) => po.id)
      );
    }
  }, [form, props.teamInfo]);

  function handleOk() {
    if (props.onOk) {
      form.validate().then(async (values) => {
        values.product_owners = values.product_owners.map((id) => ({
          id: id,
        }));
        values.scrum_masters = values.scrum_masters.map((id) => ({
          id: id,
        }));
        values.members = values.members.map((id) => ({
          id: id,
        }));
        setSubmitting(true);
        props.onOk(values).finally(() => {
          setSubmitting(false);
        });
      });
    } else {
      form.clearFields();
    }
  }

  function handleCancel() {
    if (props.onCancel) {
      props.onCancel();
    } else {
      form.clearFields();
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
        form.clearFields();
      }}
      confirmLoading={submitting}
    >
      <Form
        form={form}
        id={'team-form'}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
      >
        {props.teamInfo && (
          <>
            <Form.Item field="id" hidden={true}>
              <Input disabled={true} />
            </Form.Item>
            <Form.Item label="团队ID" field="id">
              <Typography.Text copyable={true}>
                {props.teamInfo.id}
              </Typography.Text>
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
        >
          <UserSelect mode={'multiple'} placeholder="请选择 Product Owner" />
        </Form.Item>
        <Form.Item
          label="ScrumMasters"
          field={'scrum_masters'}
          rules={[{ required: true, message: '请选择 Scrum Master' }]}
        >
          <UserSelect mode={'multiple'} placeholder="请选择 Scrum Master" />
        </Form.Item>
        <Form.Item label="团队成员" field={'members'}>
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
