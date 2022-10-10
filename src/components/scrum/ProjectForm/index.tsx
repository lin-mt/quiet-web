import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Typography } from '@arco-design/web-react';
import { QuietFormProps } from '@/components/type';
import { ScrumProject } from '@/service/scrum/type';
import UserSelect from '@/components/UserSelect';
import TeamSelect from '@/components/TeamSelect';
import TemplateSelect from '@/components/scrum/TemplateSelect';

const { useForm } = Form;

export type ScrumProjectFormProps = QuietFormProps<ScrumProject>;

function ScrumProjectForm(props: ScrumProjectFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    if (props.formValues) {
      form.setFieldsValue(props.formValues);
    }
  }, [form, props.formValues]);

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
      style={{ width: 800 }}
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
        initialValues={props.formValues}
        id={'scrum-project-form'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
      >
        {props.formValues && (
          <>
            <Form.Item hidden field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'项目ID'} field="id">
              <Typography.Text copyable>{props.formValues.id}</Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item
          label="项目名称"
          field="name"
          rules={[
            { required: true, message: '请输入项目名称' },
            { maxLength: 30, message: '项目名称长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item
          label={'任务模版'}
          field={'template_id'}
          rules={[{ required: true, message: '请选择任务模板' }]}
        >
          <TemplateSelect placeholder={'请输入模板名称'} />
        </Form.Item>
        <Form.Item
          label={'项目经理'}
          field={'manager'}
          rules={[{ required: true, message: '请选择项目经理' }]}
        >
          <UserSelect placeholder={'请输入项目经理用户名/姓名'} />
        </Form.Item>
        <Form.Item
          label={'负责团队'}
          field={'team_id'}
          rules={[{ required: true, message: '请选择负责该项目的团队' }]}
        >
          <TeamSelect placeholder={'请输入团队名称'} />
        </Form.Item>
        <Form.Item
          label="备注"
          field="remark"
          rules={[{ maxLength: 100, message: '描述信息长度不能超过 100' }]}
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

export default ScrumProjectForm;
