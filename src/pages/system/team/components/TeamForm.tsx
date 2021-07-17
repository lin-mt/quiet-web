import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal } from 'antd';
import { saveTeam, updateTeam } from '@/services/system/QuietTeam';
import { listUsersByName } from '@/services/system/QuietUser';
import { DebounceSelect } from '@/pages/components/DebounceSelect';
import type { QuietTeam, QuietUser } from '@/services/system/EntityType';

type TeamFormProps = {
  visible: boolean;
  onCancel: () => void;
  updateInfo?: QuietTeam;
  afterAction?: () => void;
};

const TeamForm: React.FC<TeamFormProps> = (props) => {
  const { visible, onCancel, updateInfo, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (updateInfo) {
      const formProductOwners = updateInfo.productOwners?.map((user: QuietUser) => {
        return { value: user.id, label: user.fullName };
      });
      const formScrumMasters = updateInfo.scrumMasters?.map((user: QuietUser) => {
        return { value: user.id, label: user.fullName };
      });
      const formMembers = updateInfo.members?.map((user: QuietUser) => {
        return { value: user.id, label: user.fullName };
      });
      const datumUpdateInfo: any = { ...updateInfo };
      datumUpdateInfo.productOwners = formProductOwners;
      datumUpdateInfo.scrumMasters = formScrumMasters;
      datumUpdateInfo.members = formMembers;
      form.setFieldsValue(datumUpdateInfo);
    } else {
      form.setFieldsValue(undefined);
    }
  }, [form, updateInfo]);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    const submitValues = {
      ...values,
      productOwners: values.productOwners?.map((user: { value: string }) => {
        return { id: user.value };
      }),
      scrumMasters: values.scrumMasters?.map((user: { value: string }) => {
        return { id: user.value };
      }),
      members: values.members?.map((user: { value: string }) => {
        return { id: user.value };
      }),
    };
    if (updateInfo) {
      await updateTeam({
        ...updateInfo,
        ...submitValues,
      });
    } else {
      await saveTeam(submitValues);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新团队';
    }
    return '新建团队';
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
      width={600}
      title={getTitle()}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={[
        <Button key="cancel" onClick={() => handleModalCancel()}>
          取消
        </Button>,
        <Button
          loading={submitting}
          key="submit"
          type="primary"
          htmlType="submit"
          onClick={handleSubmit}
        >
          {getSubmitButtonName()}
        </Button>,
      ]}
    >
      <Form form={form} name="teamForm" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
        <Col>
          <Form.Item
            label="团队名称"
            name="teamName"
            rules={[
              { required: true, message: '请输入团队名称' },
              { max: 16, message: '团队名称长度不能超过 16' },
            ]}
          >
            <Input placeholder="请输入团队名称" />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name={'productOwners'}
            label="ProductOwners"
            rules={[{ required: true, message: '请选择 PO' }]}
          >
            <DebounceSelect
              mode="multiple"
              placeholder="请输入 ProductOwner 用户名/姓名"
              fetchOptions={findUserByName}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name={'scrumMasters'}
            label="ScrumMaster"
            rules={[{ required: true, message: '请选择 SM' }]}
          >
            <DebounceSelect
              mode="multiple"
              placeholder="请输入 ScrumMaster 用户名/姓名"
              fetchOptions={findUserByName}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name={'members'}
            label="团队成员"
            rules={[{ required: true, message: '请选择团队成员' }]}
          >
            <DebounceSelect
              mode="multiple"
              placeholder="请输入团队成员 用户名/姓名"
              fetchOptions={findUserByName}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="标语"
            name="slogan"
            rules={[{ max: 30, message: '团队标语的长度不能超过 30' }]}
          >
            <Input placeholder="请输入团队标语" />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default TeamForm;
