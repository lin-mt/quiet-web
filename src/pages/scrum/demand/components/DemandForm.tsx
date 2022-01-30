import { useEffect, useState } from 'react';
import { saveDemand, updateDemand } from '@/services/scrum/ScrumDemand';
import { Button, Form, Input, Modal, Select } from 'antd';
import { DictionarySelect } from '@/pages/components/DictionarySelect';
import { DictionaryType } from '@/types/Type';
import type { ScrumDemand, ScrumPriority } from '@/services/scrum/EntitiyType';

interface DemandFormProps {
  visible: boolean;
  projectId: string;
  priorities: ScrumPriority[];
  onCancel: () => void;
  updateInfo?: ScrumDemand;
  afterAction?: (newDemandInfo: ScrumDemand) => void;
}

export default (props: DemandFormProps) => {
  const { visible, onCancel, updateInfo, projectId, priorities, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(updateInfo);
  }, [form, updateInfo]);

  const prioritiesOptions = priorities.map((priority) => {
    return { key: priority.id, value: priority.id, label: priority.name };
  });

  async function handleSubmit() {
    const values = await form.validateFields();
    values.projectId = projectId;
    setSubmitting(true);
    let newDemandInfo: ScrumDemand;
    if (updateInfo) {
      newDemandInfo = await updateDemand({
        ...updateInfo,
        ...values,
      });
    } else {
      newDemandInfo = await saveDemand(values);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction(newDemandInfo);
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新需求信息';
    }
    return '新建需求';
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
      width={600}
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
      <Form form={form} name={'demandForm'} labelCol={{ span: 5 }}>
        <Form.Item
          label={'需求标题'}
          name={'title'}
          rules={[
            { required: true, message: '请输入需求标题' },
            { max: 30, message: '需求标题长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item
          label={'需求类型'}
          name={'type'}
          rules={[{ required: true, message: '请选择需求类型' }]}
        >
          <DictionarySelect placeholder={'请选择需求类型'} type={DictionaryType.DemandType} />
        </Form.Item>
        <Form.Item
          label={'优先级'}
          name={'priority_id'}
          rules={[{ required: true, message: '请选择优先级' }]}
        >
          <Select showSearch={true} placeholder="请选择优先级" options={prioritiesOptions} />
        </Form.Item>
        <Form.Item
          label={'需求备注'}
          name={'remark'}
          rules={[
            { max: 3000, message: '备注信息长度不能超过 3000' },
            { required: true, message: '请输入备注信息' },
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
