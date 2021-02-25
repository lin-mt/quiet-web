import React, { useState } from 'react';
import { Button, Form, Input, Modal, Select, Spin } from 'antd';
import { saveProject, updateProject } from '@/services/scrum/ScrumProject';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';
import { listUsersByUsername } from '@/services/system/QuietUser';
import { listTeamsByTeamName } from '@/services/system/QuietTeam';
import multipleSelectTagRender from '@/utils/RenderUtils';

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
  const [fetchUsers, setFetchUsers] = useState<SystemEntities.QuietUser[] | undefined>([]);
  const [fetchTeams, setFetchTeams] = useState<SystemEntities.QuietTeam[] | undefined>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    switch (operationType) {
      case OperationType.CREATE:
        await saveProject({
          ...values,
          manager: values.manager.value,
          teamIds: values.teams.map((v: { value: any }) => v.value),
        });
        break;
      case OperationType.UPDATE:
        await updateProject({
          ...updateInfo,
          ...values,
          manager: values.manager.value,
          teamIds: values.teams.map((v: { value: any }) => v.value),
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

  function findUserByUserName(username: string) {
    setFetching(true);
    listUsersByUsername(username)
      .then((resp) => {
        setFetchUsers(resp.data);
      })
      .finally(() => setFetching(false));
  }

  function handleManagerChange() {
    setFetchUsers([]);
  }

  function findTeamByTeamName(teamName: string) {
    setFetching(true);
    listTeamsByTeamName(teamName)
      .then((resp) => {
        setFetchTeams(resp.data);
      })
      .finally(() => setFetching(false));
  }

  function handleTeamsChange() {}

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
          <Select
            showSearch={true}
            labelInValue={true}
            placeholder={'请输入项目用户名'}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={findUserByUserName}
            onChange={handleManagerChange}
            onBlur={() => setFetchUsers([])}
          >
            {fetchUsers?.map((user) => (
              <Select.Option key={user.id} value={user.id}>
                {user.username}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={'负责团队'}
          name={'teams'}
          rules={[{ required: true, message: '请选择负责该项目的团队' }]}
        >
          <Select
            mode={'multiple'}
            showSearch={true}
            labelInValue={true}
            placeholder={'请输入团队名称'}
            tagRender={multipleSelectTagRender}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={findTeamByTeamName}
            onChange={handleTeamsChange}
            onBlur={() => setFetchTeams([])}
          >
            {fetchTeams?.map((team) => (
              <Select.Option key={team.id} value={team.id}>
                {team.teamName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={'构建工具'} name={'buildTool'}>
          <Select placeholder={'请选择'} allowClear>
            <Select.Option value={'MAVEN'}>Maven</Select.Option>
            <Select.Option value={'GRADLE'}>Gradle</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={'需求前缀'}
          name={'demandPrefix'}
          rules={[{ max: 6, message: '需求前缀长度不能超过 6' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label={'任务前缀'}
          name={'taskPrefix'}
          rules={[{ max: 6, message: '任务前缀长度不能超过 6' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label={'任务模版'} name={'taskTemplateId'}>
          <Input placeholder="请选择" />
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
