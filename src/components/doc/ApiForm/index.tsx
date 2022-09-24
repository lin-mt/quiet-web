import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Typography } from '@arco-design/web-react';
import { DocApi, HttpMethod } from '@/service/doc/type';
import { enumToSelectOptions } from '@/utils/render';
import ApiGroupSelect from '@/components/doc/ApiGroupSelect';
import { QuietFormProps } from '@/components/type';

const { useForm } = Form;

export type ApiFormProps = QuietFormProps<DocApi> & {
  projectId: string;
  groupId?: string;
};

function ApiForm(props: ApiFormProps) {
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
        values.project_id = props.projectId;
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
        id={'api-form'}
        initialValues={props.formValues}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
      >
        {props.formValues && (
          <>
            <Form.Item hidden field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'ID'} field="id">
              <Typography.Text copyable>{props.formValues.id}</Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item
          label="名称"
          field="name"
          rules={[
            { required: true, message: '请输入接口名称' },
            { maxLength: 30, message: '接口名称长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入接口名称" />
        </Form.Item>
        <Form.Item
          label={'接口地址'}
          field={'path'}
          rules={[
            { required: true, message: '请输入接口地址' },
            {
              maxLength: 300,
              message: '接口地址长度不能超过 300',
              type: 'string',
            },
          ]}
        >
          <Input
            addBefore={
              <Form.Item noStyle field="method" initialValue={HttpMethod.GET}>
                <Select
                  style={{ width: 105 }}
                  options={enumToSelectOptions(HttpMethod)}
                />
              </Form.Item>
            }
            placeholder="请输入请求地址"
          />
        </Form.Item>
        <Form.Item
          label={'接口分组'}
          field="api_group_id"
          initialValue={props.groupId}
        >
          <ApiGroupSelect
            projectId={props.projectId}
            placeholder="请输入分组名称"
          />
        </Form.Item>
        <Form.Item
          label="备注"
          field="remark"
          rules={[{ maxLength: 300, message: '备注信息长度不能超过 300' }]}
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

export default ApiForm;
