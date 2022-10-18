import React, { useEffect, useState } from 'react';
import { QuietFormProps } from '@/components/type';
import { ScrumDemand } from '@/service/scrum/type';
import { Form, Input, Modal, Select, Typography } from '@arco-design/web-react';
import DictSelect from '@/components/DictSelect';
import { getProject } from '@/service/scrum/project';
import { listPriority } from '@/service/scrum/priority';

const { useForm } = Form;

export type DemandFormProps = QuietFormProps<ScrumDemand> & {
  projectId: string;
};

function DemandForm(props: DemandFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(props.formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.formValues)]);

  useEffect(() => {
    if (!props.visible) {
      return;
    }
    getProject(props.projectId).then((resp) => {
      listPriority(resp.template_id).then((resp) => {
        setPriorityOptions(resp.map((p) => ({ value: p.id, label: p.name })));
      });
    });
  }, [props.projectId, props.visible]);

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
        id={'scrum-demand-form'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
      >
        {props.formValues && (
          <>
            <Form.Item hidden field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'需求ID'} field="id">
              <Typography.Text copyable>{props.formValues.id}</Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item hidden field="iteration_id">
          <Input />
        </Form.Item>
        <Form.Item
          label="标题"
          field="title"
          rules={[
            { required: true, message: '请输入需求标题' },
            { maxLength: 30, message: '需求标题长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入需求标题" />
        </Form.Item>
        <Form.Item
          label="需求类型"
          field="type"
          rules={[{ required: true, message: '请选择需求类型' }]}
        >
          <DictSelect
            serviceId={'quiet-scrum'}
            typeKey={'demand-type'}
            placeholder={'请选择需求类型'}
          />
        </Form.Item>
        <Form.Item
          label="优先级"
          field="priority_id"
          rules={[{ required: true, message: '请选择优先级' }]}
        >
          <Select options={priorityOptions} placeholder={'请选择优先级'} />
        </Form.Item>
        <Form.Item
          label="备注"
          field="remark"
          rules={[{ maxLength: 3000, message: '备注信息长度不能超过 3000' }]}
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

export default DemandForm;
