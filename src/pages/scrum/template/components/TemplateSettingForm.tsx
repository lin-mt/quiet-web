import React, { useState } from 'react';
import { Button, Col, Form, Modal, Popconfirm, Row, Space, Steps, Tooltip } from 'antd';
import {
  batchUpdateTaskStep,
  deleteTaskStep,
  getAllByTemplateId as getAllTaskStepByTemplateId,
} from '@/services/scrum/ScrumTaskStep';
import {
  batchUpdatePriorities,
  deletePriority,
  findAllByTemplateId as getAllPrioritiesByTemplateId,
  updatePriority,
} from '@/services/scrum/ScrumPriority';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  EditFilled,
  PlusOutlined,
} from '@ant-design/icons';
import TaskStepForm from '@/pages/scrum/taskStep/components/TaskStepForm';
import PriorityForm from '@/pages/scrum/priority/components/PriorityForm';
import ColorPicker from '@/pages/components/ColorPicker';

type TemplateSettingFormProps = {
  visible: boolean;
  onCancel: () => void;
  template: ScrumEntities.ScrumTemplate;
  readOnly?: boolean;
  afterAction?: () => void;
};

const TemplateSettingForm: React.FC<TemplateSettingFormProps> = ({
  visible,
  template,
  readOnly = true,
  afterAction,
  onCancel,
}) => {
  const [taskSteps, setTaskSteps] = useState<ScrumEntities.ScrumTaskStep[] | undefined>(
    template.taskSteps,
  );
  const [priorities, setPriorities] = useState<ScrumEntities.ScrumPriority[] | undefined>(
    template.priorities,
  );
  const [updateTaskStepInfo, setUpdateTaskStepInfo] = useState<ScrumEntities.ScrumTaskStep>();
  const [updatePriorityInfo, setUpdatePriorityInfo] = useState<ScrumEntities.ScrumPriority>();
  const [taskStepFormVisible, setTaskStepFormVisible] = useState<boolean>(false);
  const [priorityFormVisible, setPriorityFormVisible] = useState<boolean>(false);
  const isUpdateTaskSteps = taskSteps && taskSteps.length > 0;
  const isUpdatePriorities = priorities && priorities.length > 0;
  const [taskStepForm] = Form.useForm();
  const [priorityForm] = Form.useForm();

  function handleModalCancel() {
    onCancel();
  }

  async function reloadTemplateTaskSteps() {
    await getAllTaskStepByTemplateId(template.id).then((resp) => {
      setTaskSteps(resp);
      setUpdateTaskStepInfo(undefined);
    });
    if (afterAction) {
      afterAction();
    }
  }

  async function reloadTemplatePriorities() {
    await getAllPrioritiesByTemplateId(template.id).then((resp) => {
      setPriorities(resp);
      setUpdatePriorityInfo(undefined);
    });
    if (afterAction) {
      afterAction();
    }
  }

  async function handleUpTaskStep(index: number) {
    if (taskSteps) {
      const updateTaskSteps = taskSteps;
      const currentStep = updateTaskSteps[index];
      updateTaskSteps[index] = updateTaskSteps[index - 1];
      updateTaskSteps[index - 1] = currentStep;
      await batchUpdateTaskStep(updateTaskSteps);
      await reloadTemplateTaskSteps();
    }
  }

  async function handleUpPriority(index: number) {
    if (priorities) {
      const updatePriorities = priorities;
      const currentPriority = updatePriorities[index];
      updatePriorities[index] = updatePriorities[index - 1];
      updatePriorities[index - 1] = currentPriority;
      await batchUpdatePriorities(updatePriorities);
      await reloadTemplatePriorities();
    }
  }

  async function handleDownTaskStep(index: number) {
    if (taskSteps) {
      const updateTaskSteps = taskSteps;
      const currentStep = updateTaskSteps[index];
      updateTaskSteps[index] = updateTaskSteps[index + 1];
      updateTaskSteps[index + 1] = currentStep;
      await batchUpdateTaskStep(updateTaskSteps);
      await reloadTemplateTaskSteps();
    }
  }

  async function handleDownPriority(index: number) {
    if (priorities) {
      const updatePriorities = priorities;
      const currentPriority = updatePriorities[index];
      updatePriorities[index] = updatePriorities[index + 1];
      updatePriorities[index + 1] = currentPriority;
      await batchUpdatePriorities(updatePriorities);
      await reloadTemplatePriorities();
    }
  }

  function getTitle() {
    if (readOnly) {
      return '模板配置';
    }
    return isUpdateTaskSteps ? '更新设置' : '设置模板';
  }

  return (
    <Modal
      destroyOnClose
      width={800}
      title={getTitle()}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={null}
    >
      <Row>
        <Col span={12}>
          {isUpdateTaskSteps && (
            <Steps direction="vertical" size="small">
              {taskSteps?.map((taskStep, index) => {
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
                                disabled={index === taskSteps.length - 1}
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
                                  taskStepForm.setFieldsValue(taskStep);
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
                                <Button
                                  danger
                                  type={'link'}
                                  size={'small'}
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>
                            </Tooltip>
                          </Space>
                        )}
                      </Space>
                    }
                    description={
                      <div className={'ant-steps-item-description'}>{taskStep.remark}</div>
                    }
                  />
                );
              })}
            </Steps>
          )}
          {!readOnly && (
            <div style={{ marginLeft: '39px' }}>
              <Button
                shape={'round'}
                icon={<PlusOutlined />}
                type={'primary'}
                onClick={() => setTaskStepFormVisible(true)}
              >
                添加步骤
              </Button>
            </div>
          )}
        </Col>
        <Col span={12}>
          {isUpdatePriorities && (
            <Steps direction="vertical" size="small">
              {priorities?.map((priority, index) => {
                return (
                  <Steps.Step
                    status={'process'}
                    key={priority.id}
                    description={
                      <div className={'ant-steps-item-description'}>{priority.remark}</div>
                    }
                    title={
                      <Space>
                        {priority.name}
                        {!readOnly && (
                          <Space>
                            <ColorPicker
                              initialValue={priority.colorHex}
                              onChange={async (color: any) => {
                                const update = priority;
                                update.colorHex = color;
                                await updatePriority(update);
                                await reloadTemplatePriorities();
                              }}
                            />
                            <Tooltip title={'上移'}>
                              <Button
                                type={'link'}
                                size={'small'}
                                disabled={index === 0}
                                icon={<CaretUpOutlined />}
                                onClick={() => handleUpPriority(index)}
                              />
                            </Tooltip>
                            <Tooltip title={'下移'}>
                              <Button
                                type={'link'}
                                size={'small'}
                                disabled={index === priorities.length - 1}
                                icon={<CaretDownOutlined />}
                                onClick={() => handleDownPriority(index)}
                              />
                            </Tooltip>
                            <Tooltip title={'编辑优先级信息'}>
                              <Button
                                type={'link'}
                                size={'small'}
                                icon={<EditFilled />}
                                onClick={() => {
                                  setUpdatePriorityInfo(priority);
                                  priorityForm.setFieldsValue(priority);
                                  setPriorityFormVisible(true);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title={'删除优先级'}>
                              <Popconfirm
                                title={`确定删除优先级 ${priority.name} 吗？`}
                                placement={'right'}
                                onConfirm={async () => {
                                  await deletePriority(priority.id);
                                  await reloadTemplatePriorities();
                                }}
                              >
                                <Button
                                  danger
                                  type={'link'}
                                  size={'small'}
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>
                            </Tooltip>
                          </Space>
                        )}
                      </Space>
                    }
                  />
                );
              })}
            </Steps>
          )}
          {!readOnly && (
            <div style={{ marginLeft: '39px' }}>
              <Button
                shape={'round'}
                icon={<PlusOutlined />}
                type={'primary'}
                onClick={() => setPriorityFormVisible(true)}
              >
                添加优先级
              </Button>
            </div>
          )}
        </Col>
      </Row>
      {taskStepFormVisible && (
        <TaskStepForm
          form={taskStepForm}
          template={template}
          visible={taskStepFormVisible}
          updateInfo={updateTaskStepInfo}
          onCancel={() => setTaskStepFormVisible(false)}
          afterAction={reloadTemplateTaskSteps}
        />
      )}
      {priorityFormVisible && (
        <PriorityForm
          form={priorityForm}
          template={template}
          visible={priorityFormVisible}
          updateInfo={updatePriorityInfo}
          onCancel={() => setPriorityFormVisible(false)}
          afterAction={reloadTemplatePriorities}
        />
      )}
    </Modal>
  );
};

export default TemplateSettingForm;
