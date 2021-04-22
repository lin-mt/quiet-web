import React, { useState } from 'react';
import { Button, Form, Modal, Popconfirm, Space, Steps, Tooltip } from 'antd';
import {
  batchUpdateTaskStep,
  deleteTaskStep,
  getAllByTemplateId,
} from '@/services/scrum/ScrumTaskStep';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  EditFilled,
  PlusOutlined,
} from '@ant-design/icons';
import TaskStepForm from '@/pages/scrum/template/components/TaskStepForm';

type TemplateSettingFormProps = {
  visible: boolean;
  onCancel: () => void;
  currentTemplate: ScrumEntities.ScrumTemplate;
  readOnly?: boolean;
  taskSteps?: ScrumEntities.ScrumTaskStep[];
  afterAction?: () => void;
};

const TemplateSettingForm: React.FC<TemplateSettingFormProps> = ({
  visible,
  currentTemplate,
  readOnly = true,
  afterAction,
  taskSteps = [],
  onCancel,
}) => {
  const [allTaskStep, setAllTaskStep] = useState<ScrumEntities.ScrumTaskStep[]>(taskSteps);
  const [updateTaskStepInfo, setUpdateTaskStepInfo] = useState<ScrumEntities.ScrumTaskStep>();
  const [taskStepFormVisible, setTaskStepFormVisible] = useState<boolean>(false);
  const isUpdate = allTaskStep && allTaskStep.length > 0;
  const [form] = Form.useForm();

  function handleModalCancel() {
    onCancel();
  }

  async function reloadTemplateTaskSteps() {
    await getAllByTemplateId(currentTemplate.id).then((resp) => {
      setAllTaskStep(resp.data);
      setUpdateTaskStepInfo(undefined);
    });
    if (afterAction) {
      afterAction();
    }
  }

  async function handleUpTaskStep(index: number) {
    const updateTaskSteps = allTaskStep;
    const currentStep = updateTaskSteps[index];
    updateTaskSteps[index] = updateTaskSteps[index - 1];
    updateTaskSteps[index - 1] = currentStep;
    await batchUpdateTaskStep(updateTaskSteps);
    await reloadTemplateTaskSteps();
  }

  async function handleDownTaskStep(index: number) {
    const updateTaskSteps = allTaskStep;
    const currentStep = updateTaskSteps[index];
    updateTaskSteps[index] = updateTaskSteps[index + 1];
    updateTaskSteps[index + 1] = currentStep;
    await batchUpdateTaskStep(updateTaskSteps);
    await reloadTemplateTaskSteps();
  }

  function getTitle() {
    if (readOnly) {
      return '模板配置';
    }
    return isUpdate ? '更新设置' : '设置模板';
  }

  return (
    <Modal
      destroyOnClose
      width={500}
      title={getTitle()}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={null}
    >
      {isUpdate && (
        <Steps direction="vertical" size="small">
          {allTaskStep?.map((taskStep, index) => {
            return (
              <Steps.Step
                status={'process'}
                key={taskStep.id}
                title={
                  <Space>
                    {taskStep.name}
                    {!readOnly && (
                      <Space>
                        <Tooltip title={'上移步骤'}>
                          <Button
                            type={'link'}
                            size={'small'}
                            disabled={index === 0}
                            icon={<CaretUpOutlined />}
                            onClick={() => handleUpTaskStep(index)}
                          />
                        </Tooltip>
                        <Tooltip title={'下移步骤'}>
                          <Button
                            type={'link'}
                            size={'small'}
                            disabled={index === allTaskStep.length - 1}
                            icon={<CaretDownOutlined />}
                            onClick={() => handleDownTaskStep(index)}
                          />
                        </Tooltip>
                        <Tooltip title={'编辑步骤信息'}>
                          <Button
                            type={'link'}
                            size={'small'}
                            icon={<EditFilled />}
                            onClick={() => {
                              setUpdateTaskStepInfo(taskStep);
                              form.setFieldsValue(taskStep);
                              setTaskStepFormVisible(true);
                            }}
                          />
                        </Tooltip>
                        <Tooltip title={'删除步骤'}>
                          <Popconfirm
                            title={`确定删除步骤 ${taskStep.name} 吗？`}
                            placement={'right'}
                            onConfirm={async () => {
                              await deleteTaskStep(taskStep.id);
                              await reloadTemplateTaskSteps();
                            }}
                          >
                            <Button danger type={'link'} size={'small'} icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </Tooltip>
                      </Space>
                    )}
                  </Space>
                }
                description={<div className={'ant-steps-item-description'}>{taskStep.remark}</div>}
              />
            );
          })}
        </Steps>
      )}
      {!readOnly && (
        <Button
          icon={<PlusOutlined />}
          type={'primary'}
          onClick={() => setTaskStepFormVisible(true)}
        >
          添加步骤
        </Button>
      )}
      {taskStepFormVisible && (
        <TaskStepForm
          form={form}
          template={currentTemplate}
          visible={taskStepFormVisible}
          updateInfo={updateTaskStepInfo}
          onCancel={() => setTaskStepFormVisible(false)}
          afterAction={reloadTemplateTaskSteps}
        />
      )}
    </Modal>
  );
};

export default TemplateSettingForm;
