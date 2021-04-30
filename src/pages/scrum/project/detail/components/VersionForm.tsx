import { useState } from 'react';
import { Button, DatePicker, Form, Input, Modal } from 'antd';
import { saveVersion, updateVersion } from '@/services/scrum/ScrumVersion';
import type { FormInstance } from 'antd/lib/form';
import { formatDate } from '@/utils/MomentUtils';

type VersionFormProps = {
  visible: boolean;
  projectId: string;
  form: FormInstance;
  onCancel: () => void;
  parentId?: string;
  updateInfo?: ScrumEntities.ScrumVersion;
  afterAction?: () => void;
};

export default (props: VersionFormProps) => {
  const { visible, projectId, parentId, onCancel, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit() {
    const values = await form.validateFields();
    values.planStartDate = formatDate(values.planStartDate);
    values.planEndDate = formatDate(values.planEndDate);
    values.projectId = projectId;
    values.parentId = parentId;
    setSubmitting(true);
    if (updateInfo) {
      await updateVersion({
        ...updateInfo,
        ...values,
      });
    } else {
      await saveVersion(values);
    }
    form.resetFields();
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新版本信息';
    }
    return '新建版本';
  }

  function getSubmitButtonName() {
    if (updateInfo) {
      return '更新';
    }
    return '保存';
  }

  function handleModalCancel() {
    form.resetFields();
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
      <Form form={form} name={'projectForm'} labelCol={{ span: 6 }}>
        <Form.Item
          label={'版本名称'}
          name={'name'}
          rules={[
            { required: true, message: '请输入版本名称' },
            { max: 10, message: '版本名称长度不能超过 10' },
          ]}
        >
          <Input placeholder="请输入版本名称" />
        </Form.Item>
        <Form.Item
          label={'计划开始日期'}
          name={'planStartDate'}
          rules={[{ required: true, message: '请选择计划开始日期' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder={'请选择计划开始日期'} />
        </Form.Item>
        <Form.Item
          label={'计划结束日期'}
          name={'planEndDate'}
          rules={[{ required: true, message: '请选择计划结束日期' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder={'请选择计划结束日期'} />
        </Form.Item>
        <Form.Item
          label={'版本备注'}
          name={'remark'}
          rules={[
            { max: 1500, message: '版本备注信息长度不能超过 1500' },
            { required: true, message: '请输入版本备注信息' },
          ]}
        >
          {
            // todo 使用富文本
          }
          <Input.TextArea placeholder="请输入备注信息" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
