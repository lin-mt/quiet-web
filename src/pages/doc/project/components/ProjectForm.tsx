import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { listUsersByName } from '@/services/system/QuietUser';
import { DebounceSelect } from '@/pages/components/DebounceSelect';
import type { DocProject } from '@/services/doc/EntityType';
import { saveProject, updateProject } from '@/services/doc/DocProject';

interface ProjectFormProps {
  visible: boolean;
  onCancel: () => void;
  updateInfo?: DocProject;
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
        principal: { value: updateInfo.principal, label: updateInfo.principalName },
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
      principal: values.principal.value,
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
          label={'负责人'}
          name={'principal'}
          rules={[{ required: true, message: '请选择文档负责人' }]}
        >
          <DebounceSelect placeholder={'请输入负责人用户名/姓名'} fetchOptions={findUserByName} />
        </Form.Item>
        <Form.Item
          label={'项目备注'}
          name={'remark'}
          rules={[{ max: 100, message: '备注信息长度不能超过 100' }]}
        >
          <Input.TextArea placeholder="请输入备注信息" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectForm;
