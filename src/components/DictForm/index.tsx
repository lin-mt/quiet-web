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
import DictSelect from '@/components/DictSelect';

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
  const [parentKey, setParentKey] = useState();
  const [selectedTypeId, setSelectedTypeId] = useState();
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
        if (parentKey) {
          values.key = parentKey + values.key;
        }
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
        setSelectedTypeId(undefined);
        setParentKey(undefined);
      }}
      confirmLoading={submitting}
    >
      <Form
        form={form}
        id={'dict-form'}
        onValuesChange={(v, vs) => {
          setSelectedTypeId(vs.type_id);
        }}
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
        <Form.Item label={'父级字典'}>
          <DictSelect
            allowClear
            typeId={selectedTypeId}
            value={parentKey}
            onChange={(value) => setParentKey(value)}
            placeholder={'请选择'}
          />
        </Form.Item>
        <Form.Item
          label="字典key"
          field="key"
          rules={[
            { required: true, message: '请输入字典key' },
            { length: 2, message: '字典key长度为 2' },
            { match: /^[0-9]+[0-9]*]*$/, message: '字典 key 必须全是数字' },
          ]}
        >
          <Input
            prefix={parentKey}
            placeholder="请输入字典key"
            suffix={
              <Tooltip content="每层级占用两位数字">
                <IconExclamationCircle />
              </Tooltip>
            }
          />
        </Form.Item>
        <Form.Item
          label="名称"
          field="name"
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
