import React, { useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { saveProject, updateProject } from '@/services/scrum/ScrumProject';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';
import { listUsersByName } from '@/services/system/QuietUser';
import { listTeamsByTeamName } from '@/services/system/QuietTeam';
import multipleSelectTagRender from '@/utils/RenderUtils';
import { DebounceSelect } from '@/pages/components/DebounceSelect';

type ProjectFormProps = {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  operationType?: OperationType;
  updateInfo?: ScrumEntities.ScrumProject;
  afterAction?: () => void;
};

const ProjectForm: React.FC<ProjectFormProps> = (props) => {
  const nonsupportMsg = 'nonsupport FormType';

  const { visible, onCancel, operationType, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    switch (operationType) {
      case OperationType.CREATE:
        await saveProject({
          ...values,
          manager: values.manager.value,
          teamIds: values.selectTeams.map((v: { value: any }) => v.value),
        });
        break;
      case OperationType.UPDATE:
        await updateProject({
          ...updateInfo,
          ...values,
          manager: values.manager.value,
          teamIds: values.selectTeams.map((v: { value: any }) => v.value),
        });
        break;
      default:
        throw Error(nonsupportMsg);
    }
    form.resetFields();
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    switch (operationType) {
      case OperationType.CREATE:
        return '新建项目';
      case OperationType.UPDATE:
        return '更新项目';
      default:
        throw Error(nonsupportMsg);
    }
  }

  function getSubmitButtonName() {
    switch (operationType) {
      case OperationType.CREATE:
        return '创建';
      case OperationType.UPDATE:
        return '更新';
      default:
        throw Error(nonsupportMsg);
    }
  }

  function handleModalCancel() {
    form.resetFields();
    onCancel();
  }

  async function findUserByName(name: string) {
    return listUsersByName(name).then((resp) => {
      return resp.data.map((user) => ({
        label: user.fullName,
        value: user.id,
      }));
    });
  }

  async function findTeamByTeamName(teamName: string) {
    return listTeamsByTeamName(teamName).then((resp) => {
      return resp.data.map((team) => ({
        label: team.teamName,
        value: team.id,
      }));
    });
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
          label={'项目名称'}
          name={'name'}
          rules={[
            { required: true, message: '请输入项目名称' },
            { max: 30, message: '项目名称长度不能超过 30' },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label={'项目经理'}
          name={'manager'}
          rules={[{ required: true, message: '请选择项目经理' }]}
        >
          <DebounceSelect placeholder={'请输入项目经理用户名/姓名'} fetchOptions={findUserByName} />
        </Form.Item>
        <Form.Item
          label={'负责团队'}
          name={'selectTeams'}
          rules={[{ required: true, message: '请选择负责该项目的团队' }]}
        >
          <DebounceSelect
            mode={'multiple'}
            placeholder={'请输入团队名称'}
            tagRender={multipleSelectTagRender}
            fetchOptions={findTeamByTeamName}
          />
        </Form.Item>
        <Form.Item
          label={'项目描述'}
          name={'description'}
          rules={[{ max: 100, message: '描述信息长度不能超过 100' }]}
        >
          <Input.TextArea placeholder="请输入描述信息" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectForm;
