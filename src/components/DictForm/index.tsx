import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Modal,
  Switch,
  Tooltip,
  Typography,
} from '@arco-design/web-react';
import { QuietDict } from '@/service/system/type';
import { enabled } from '@/utils/render';
import DictTypeSelect from '@/components/DictTypeSelect';
import { IconExclamationCircle } from '@arco-design/web-react/icon';

const { useForm } = Form;

export type DictFormProps = {
  dict?: QuietDict;
  title?: string;
  visible?: boolean;
  onOk?: (values: QuietDict) => Promise<QuietDict | void>;
  okText?: string;
  onCancel?: () => void;
  cancelText?: string;
};

function DictForm(props: DictFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    if (props.dict) {
      form.setFieldsValue(props.dict);
    }
  }, [form, props.dict]);

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
        id={'dict-form'}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 19 }}
      >
        {props.dict && (
          <>
            <Form.Item hidden={true} field="id">
              <Input />
            </Form.Item>
            <Form.Item label={'字典ID'} field="id">
              <Typography.Text copyable={true}>{props.dict.id}</Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item
          label="类型"
          field="type_id"
          rules={[{ required: true, message: '请选择字典类型' }]}
        >
          <DictTypeSelect placeholder="请选择字典类型" />
        </Form.Item>
        <Form.Item
          label="字典key"
          field="key"
          rules={[
            { required: true, message: '请输入字典key' },
            { minLength: 2, maxLength: 18, message: '字典key长度在 2 - 18' },
            {
              validator: async (value, callback) => {
                return new Promise((resolve) => {
                  if (value.length % 2 != 0) {
                    setTimeout(() => {
                      callback('字典 key 必须是 2 的倍数');
                      resolve();
                    }, 1000);
                  } else {
                    resolve();
                  }
                });
              },
            },
          ]}
        >
          <Input
            placeholder="请输入字典key"
            suffix={
              <Tooltip content="格式为每层级占两位数字，第一层级范围：00-99，第二层级的前两位为第一层级的key， 所以第二层级范围为：0000-9999，后续层级以此类推">
                <IconExclamationCircle />
              </Tooltip>
            }
          />
        </Form.Item>
        <Form.Item
          label="名称"
          field="label"
          rules={[
            { required: true, message: '请输入名称' },
            { maxLength: 10, message: '名称不能超过 10' },
          ]}
        >
          <Input placeholder="请输入字典名称" />
        </Form.Item>
        <Form.Item
          label="启用状态"
          field="enabled"
          initialValue={true}
          triggerPropName="checked"
        >
          <Switch checkedText={enabled(true)} uncheckedText={enabled(false)} />
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

export default DictForm;
