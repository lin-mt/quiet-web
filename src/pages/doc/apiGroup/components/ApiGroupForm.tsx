import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import type { DocApiGroup } from '@/services/doc/EntityType';
import { saveApiGroup, updateApiGroup } from '@/services/doc/DocApiGroup';

interface ApiGroupFormProps {
  visible: boolean;
  projectId: string;
  onCancel: () => void;
  updateInfo?: DocApiGroup;
  afterAction?: () => void;
}

export default (props: ApiGroupFormProps) => {
  const { visible, projectId, onCancel, updateInfo, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (updateInfo) {
      form.setFieldsValue({
        ...updateInfo,
      });
    } else {
      form.setFieldsValue(undefined);
    }
  }, [form, updateInfo]);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    const submitValues = {
      ...values,
      projectId,
    };
    if (updateInfo) {
      await updateApiGroup({
        ...updateInfo,
        ...submitValues,
      });
    } else {
      await saveApiGroup(submitValues);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新分组';
    }
    return '新建分组';
  }

  function getSubmitButtonName() {
    if (updateInfo) {
      return '更新';
    }
    return '保存';
  }

  function handleModalCancel() {
    form.setFieldsValue(undefined);
    onCancel();
  }

  return (
    <Modal
      destroyOnClose
      width={500}
      title={getTitle()}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={[
        <Button key={'cancel'} onClick={() => handleModalCancel()}>
          取消
        </Button>,
        <Button
          loading={submitting}
          key={'submit'}
          type={'primary'}
          htmlType={'submit'}
          onClick={handleSubmit}
        >
          {getSubmitButtonName()}
        </Button>,
      ]}
    >
      <Form form={form} name={'projectForm'} labelCol={{ span: 5 }}>
        <Form.Item
          label={'分组名称'}
          name={'name'}
          rules={[
            { required: true, message: '请输入分组名称' },
            { max: 30, message: '分组名称长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label={'备注'}
          name={'remark'}
          rules={[{ max: 300, message: '备注信息长度不能超过 300' }]}
        >
          <Input.TextArea placeholder="请输入备注信息" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
