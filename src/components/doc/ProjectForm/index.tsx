import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Typography } from '@arco-design/web-react';
import { DocProject } from '@/service/doc/type';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/store';
import UserSelect from '@/components/UserSelect';
import ProjectGroupSelect from '@/components/doc/ProjectGroupSelect';

const { useForm } = Form;

export type DocProjectFormProps = {
  project?: DocProject;
  title?: string;
  visible?: boolean;
  onOk?: (values: DocProject) => Promise<DocProject | void>;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
};

function DocProjectForm(props: DocProjectFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const userInfo = useSelector((state: GlobalState) => state.userInfo);
  const [form] = useForm();

  useEffect(() => {
    if (props.project) {
      form.setFieldsValue(props.project);
    }
  }, [form, props.project, userInfo.id]);

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
      style={{ width: 600 }}
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
        id={'doc-project-form'}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
      >
        {props.project && (
          <>
            <Form.Item hidden field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'项目ID'} field="id">
              <Typography.Text copyable>{props.project.id}</Typography.Text>
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
          label="负责人"
          field="principal"
          initialValue={props.project ? props.project.principal : userInfo.id}
          rules={[{ required: true, message: '请选择项目负责人' }]}
        >
          <UserSelect placeholder="请选择项目负责人" />
        </Form.Item>
        <Form.Item hidden={!props.project} label="所属分组" field="group_id">
          <ProjectGroupSelect placeholder={'请选择项目分组'} />
        </Form.Item>
        <Form.Item
          label="备注"
          field="remark"
          rules={[{ maxLength: 100, message: '备注信息长度不能超过 100' }]}
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

export default DocProjectForm;
