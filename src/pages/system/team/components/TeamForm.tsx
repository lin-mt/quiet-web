import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, Select, Spin, Tag } from 'antd';
import { saveTeam, updateTeam } from '@/services/system/QuietTeam';
import { listUsersByUsername } from '@/services/system/QuietUser';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';
import type { CustomTagProps } from 'rc-select/lib/interface/generator';

const { Option } = Select;

type TeamFormProps = {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  operationType?: OperationType;
  updateInfo?: SystemEntities.QuietTeam;
  afterAction?: () => void;
};

const RoleForm: React.FC<TeamFormProps> = (props) => {
  const { visible, onCancel, operationType, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fetchUsers, setFetchUsers] = useState<SystemEntities.QuietUser[] | undefined>([]);
  const [productOwners, setProductOwners] = useState<any[]>(
    form.getFieldValue('productOwners')?.map((user: SystemEntities.QuietUser) => {
      return { value: user.id, label: user.username };
    }),
  );
  const [scrumMasters, setScrumMasters] = useState<any[]>(
    form.getFieldValue('scrumMasters')?.map((user: SystemEntities.QuietUser) => {
      return { value: user.id, label: user.username };
    }),
  );
  const [members, setMembers] = useState<any[]>(
    form.getFieldValue('members')?.map((user: SystemEntities.QuietUser) => {
      return { value: user.id, label: user.username };
    }),
  );
  const [fetching, setFetching] = useState<boolean>(false);
  const nonsupportMsg = 'nonsupport FormType';

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    switch (operationType) {
      case OperationType.CREATE:
        await saveTeam({
          ...values,
          productOwners: productOwners?.map((user) => {
            return { id: user.value };
          }),
          scrumMasters: scrumMasters?.map((user) => {
            return { id: user.value };
          }),
          members: members?.map((user) => {
            return { id: user.value };
          }),
        });
        break;
      case OperationType.UPDATE:
        await updateTeam({
          ...updateInfo,
          ...values,
          productOwners: productOwners?.map((user) => {
            return { id: user.value };
          }),
          scrumMasters: scrumMasters?.map((user) => {
            return { id: user.value };
          }),
          members: members?.map((user) => {
            return { id: user.value };
          }),
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
        return '新建团队';
      case OperationType.UPDATE:
        return '更新团队';
      default:
        throw Error(nonsupportMsg);
    }
  }

  function getSubmitButtonName() {
    switch (operationType) {
      case OperationType.CREATE:
        return '保存';
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
    listUsersByUsername(username).then((resp) => {
      setFetchUsers(resp.data);
      setFetching(false);
    });
  }

  function handleProductOwnersChange(value: any) {
    setProductOwners(value);
    setFetchUsers([]);
  }

  function handleScrumMastersChange(value: any) {
    setScrumMasters(value);
    setFetchUsers([]);
  }

  function handleMembersChange(value: any) {
    setMembers(value);
    setFetchUsers([]);
  }

  function tagRender(tagProps: CustomTagProps) {
    const { label, closable, onClose } = tagProps;
    return (
      <Tag color={'#108EE9'} closable={closable} onClose={onClose}>
        {label}
      </Tag>
    );
  }

  return (
    <Modal
      destroyOnClose
      width={600}
      title={getTitle()}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={[
        <Button key="back" onClick={() => handleModalCancel()}>
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
          <Form.Item label="ProductOwner">
            <Select
              mode="multiple"
              labelInValue
              value={productOwners}
              tagRender={tagRender}
              placeholder="请输入 ProductOwner 用户名"
              notFoundContent={fetching ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={findUserByUserName}
              onChange={handleProductOwnersChange}
              onBlur={() => setFetchUsers([])}
            >
              {fetchUsers?.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="ScrumMaster">
            <Select
              mode="multiple"
              labelInValue
              value={scrumMasters}
              tagRender={tagRender}
              placeholder="请输入 ScrumMaster 用户名"
              notFoundContent={fetching ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={findUserByUserName}
              onChange={handleScrumMastersChange}
              onBlur={() => setFetchUsers([])}
            >
              {fetchUsers?.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="团队成员">
            <Select
              mode="multiple"
              labelInValue
              value={members}
              tagRender={tagRender}
              placeholder="请输入团队成员用户名"
              notFoundContent={fetching ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={findUserByUserName}
              onChange={handleMembersChange}
              onBlur={() => setFetchUsers([])}
            >
              {fetchUsers?.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
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

export default RoleForm;
