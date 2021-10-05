import { useEffect, useState } from 'react';
import { saveIteration, updateIteration } from '@/services/scrum/ScrumIteration';
import { Button, DatePicker, Form, Input, Modal } from 'antd';
import { formatDate } from '@/utils/MomentUtils';
import type { ScrumIteration } from '@/services/scrum/EntitiyType';

interface IterationFormProps {
  visible: boolean;
  versionId: string;
  onCancel: () => void;
  updateInfo?: ScrumIteration;
  afterAction?: () => void;
}

export default (props: IterationFormProps) => {
  const { visible, versionId, onCancel, updateInfo, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(updateInfo);
  }, [form, updateInfo]);

  async function handleSubmit() {
    const values = await form.validateFields();
    values.plan_start_date = formatDate(values.plan_start_date);
    values.plan_end_date = formatDate(values.plan_end_date);
    if (!updateInfo) {
      values.version_id = versionId;
    }
    setSubmitting(true);
    if (updateInfo) {
      await updateIteration({
        ...updateInfo,
        ...values,
      });
    } else {
      await saveIteration(values);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新迭代信息';
    }
    return '新建迭代';
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
      <Form form={form} name={'iterationForm'} labelCol={{ span: 6 }}>
        <Form.Item
          label={'迭代名称'}
          name={'name'}
          rules={[
            { required: true, message: '请输入迭代名称' },
            { max: 10, message: '迭代名称长度不能超过 10' },
          ]}
        >
          <Input placeholder="请输入迭代名称" />
        </Form.Item>
        <Form.Item
          label={'计划开始日期'}
          name={'plan_start_date'}
          rules={[{ required: true, message: '请选择计划开始日期' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder={'请选择计划开始日期'} />
        </Form.Item>
        <Form.Item
          label={'计划结束日期'}
          name={'plan_end_date'}
          rules={[{ required: true, message: '请选择计划结束日期' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder={'请选择计划结束日期'} />
        </Form.Item>
        <Form.Item
          label={'迭代备注'}
          name={'remark'}
          rules={[
            { max: 1000, message: '迭代备注信息长度不能超过 1000' },
            { required: true, message: '请输入迭代备注信息' },
          ]}
        >
          {
            // todo 使用Markdown
          }
          <Input.TextArea placeholder="请输入备注信息" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
