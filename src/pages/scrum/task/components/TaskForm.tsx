import { useEffect, useState } from 'react';
import { saveTask, updateTask } from '@/services/scrum/ScrumTask';
import { Button, Form, Input, Modal, Select } from 'antd';
import { DictionaryType } from '@/types/Type';
import type { ScrumTask } from '@/services/scrum/EntitiyType';
import type { QuietUser } from '@/services/system/EntityType';
import { multipleSelectTagRender } from '@/utils/RenderUtils';
import { DictionaryCascader } from '@/pages/components/DictionaryCascader';
import { buildDictionaryCascaderValue } from '@/utils/system/utils';
import { useModel } from '@@/plugin-model/useModel';
import { DICTIONARY } from '@/constant/system/ModelNames';

interface TaskFormProps {
  visible: boolean;
  demandId: string;
  taskStepId: string;
  executors: QuietUser[];
  onCancel: () => void;
  updateInfo?: ScrumTask;
  afterAction?: (newTaskInfo: ScrumTask) => void;
}

export default (props: TaskFormProps) => {
  const { visible, onCancel, updateInfo, demandId, executors, taskStepId, afterAction } = props;

  const { getDictionariesByType } = useModel(DICTIONARY);

  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (updateInfo) {
      getDictionariesByType(DictionaryType.TaskType).then((dictionaries) => {
        const newUpdateInfo: any = { ...updateInfo };
        newUpdateInfo.type = buildDictionaryCascaderValue(dictionaries, updateInfo.type);
        form.setFieldsValue(newUpdateInfo);
      });
    } else {
      form.setFieldsValue(undefined);
    }
  }, [form, getDictionariesByType, updateInfo]);

  async function handleSubmit() {
    const values = await form.validateFields();
    values.type = values.type[values.type.length - 1];
    setSubmitting(true);
    let newTaskInfo: ScrumTask;
    if (updateInfo) {
      newTaskInfo = await updateTask({
        ...updateInfo,
        ...values,
      });
    } else {
      values.demandId = demandId;
      values.taskStepId = taskStepId;
      newTaskInfo = await saveTask(values);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction(newTaskInfo);
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新任务信息';
    }
    return '创建任务';
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
      <Form form={form} name={'taskForm'} labelCol={{ span: 5 }}>
        <Form.Item
          label={'任务标题'}
          name={'title'}
          rules={[
            { required: true, message: '请输入任务标题' },
            { max: 10, message: '任务标题长度不能超过 10' },
          ]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item
          label={'任务类型'}
          name={'type'}
          rules={[{ required: true, message: '请选择任务类型' }]}
        >
          <DictionaryCascader placeholder={'请选择任务类型'} type={DictionaryType.TaskType} />
        </Form.Item>
        <Form.Item
          label={'执行者'}
          name={'executorId'}
          rules={[{ required: true, message: '请选择执行者' }]}
        >
          <Select
            showSearch={true}
            placeholder="请选择执行者"
            options={executors.map((executor) => ({
              label: executor.fullName,
              value: executor.id,
            }))}
          />
        </Form.Item>
        <Form.Item label={'参与者'} name={'participant'}>
          <Select
            mode={'multiple'}
            showSearch={true}
            placeholder="请选择参与者"
            tagRender={multipleSelectTagRender}
            options={executors.map((executor) => ({
              label: executor.fullName,
              value: executor.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label={'任务备注'}
          name={'remark'}
          rules={[
            { max: 3000, message: '备注信息长度不能超过 3000' },
            { required: true, message: '请输入任务备注信息' },
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
