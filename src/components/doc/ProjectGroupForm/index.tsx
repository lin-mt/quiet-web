import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Typography } from '@arco-design/web-react';
import { DocProjectGroup } from '@/service/doc/type';

const { useForm } = Form;

export type ProjectGroupFormProps = {
  groupInfo?: DocProjectGroup;
  title?: string;
  visible?: boolean;
  onOk?: (values: DocProjectGroup) => Promise<DocProjectGroup | void>;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
};

function ProjectGroupForm(props: ProjectGroupFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    if (props.groupInfo) {
      form.setFieldsValue(props.groupInfo);
    }
  }, [form, props.groupInfo]);

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
        id={'project-group-form'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
      >
        {props.groupInfo && (
          <>
            <Form.Item hidden={true} field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'分组ID'} field="id">
              <Typography.Text copyable={true}>
                {props.groupInfo.id}
              </Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item
          label="名称"
          field="name"
          rules={[
            { required: true, message: '请输入分组名称' },
            { max: 30, message: '分组名称长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入分组名称" />
        </Form.Item>
        <Form.Item
          label="备注"
          field="remark"
          rules={[{ max: 300, message: '备注信息长度不能超过 300' }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 7 }}
            placeholder="请输入备注信息"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProjectGroupForm;
