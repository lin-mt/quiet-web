import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { saveProject, updateProject } from '@/services/scrum/ScrumProject';
import { listUsersByName } from '@/services/system/QuietUser';
import { listTeamsByTeamName } from '@/services/system/QuietTeam';
import { multipleSelectTagRender } from '@/utils/RenderUtils';
import { DebounceSelect } from '@/pages/components/DebounceSelect';
import { listEnabledByName } from '@/services/scrum/ScrumTemplate';
import type { ScrumProject } from '@/services/scrum/EntitiyType';

interface ProjectFormProps {
  visible: boolean;
  onCancel: () => void;
  updateInfo?: ScrumProject;
  afterAction?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = (props) => {
  const { visible, onCancel, updateInfo, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (updateInfo) {
      form.setFieldsValue({
        ...updateInfo,
        templateId: { value: updateInfo.templateId, label: updateInfo.templateName },
        manager: { value: updateInfo.manager, label: updateInfo.managerName },
        selectTeams: updateInfo.teams?.map((team) => {
          return { value: team.id, label: team.teamName };
        }),
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
      templateId: values.templateId.value,
      manager: values.manager.value,
      teamIds: values.selectTeams.map((v: { value: any }) => v.value),
    };
    if (updateInfo) {
      await updateProject({
        ...updateInfo,
        ...submitValues,
      });
    } else {
      await saveProject(submitValues);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新项目';
    }
    return '新建项目';
  }

  function getSubmitButtonName() {
    if (updateInfo) {
      return '更新';
    }
    return '创建';
  }

  function handleModalCancel() {
    form.setFieldsValue(undefined);
    onCancel();
  }

  async function findUserByName(name: string) {
    return listUsersByName(name).then((resp) => {
      return resp.map((user) => ({
        label: user.fullName,
        value: user.id,
      }));
    });
  }

  async function findTeamByTeamName(teamName: string) {
    return listTeamsByTeamName(teamName).then((resp) => {
      return resp.map((team) => ({
        label: team.teamName,
        value: team.id,
      }));
    });
  }

  async function findByTemplateName(name: string) {
    return listEnabledByName(name).then((resp) => {
      return resp.map((template) => ({
        label: template.name,
        value: template.id,
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
          label={'任务模版'}
          name={'templateId'}
          rules={[{ required: true, message: '请选择任务模板' }]}
        >
          <DebounceSelect fetchOptions={findByTemplateName} placeholder="请选择" />
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
