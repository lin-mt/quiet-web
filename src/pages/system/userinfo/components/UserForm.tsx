import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { registeredUser, updateUser } from '@/services/system/QuiteUser';
import { FormInstance } from 'antd/lib/form';

const { Option } = Select;

export enum UserFormType {
  CREATE = 'create',
  UPDATE = 'update',
  REGISTERED = 'registered'
}

interface UserFormProps {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  userFormType?: UserFormType;
  updateUserInfo?: SystemEntities.QuiteUser;
}

const UserForm: React.FC<UserFormProps> = (props) => {
  const { visible, onCancel, userFormType, updateUserInfo, form } = props;
  const [submitButtonLoading, setSubmitButtonLoading] = useState<boolean>(false);
  const nonsupportMsg = 'nonsupport UserFormType';

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitButtonLoading(true);
    switch (userFormType) {
      case UserFormType.CREATE:
        await registeredUser(values);
        break;
      case UserFormType.UPDATE:
        await updateUser({ ...updateUserInfo, ...values });
        break;
      default:
        throw Error(nonsupportMsg);
    }
    form.resetFields();
    setSubmitButtonLoading(false);
    onCancel();
  }

  function getTitle() {
    switch (userFormType) {
      case UserFormType.CREATE:
        return '新建用户';
      case UserFormType.UPDATE:
        return '更新用户';
      case UserFormType.REGISTERED:
        return '注册';
      default:
        throw Error(nonsupportMsg);
    }
  }

  function getSubmitButtonName() {
    switch (userFormType) {
      case UserFormType.CREATE:
        return '保存';
      case UserFormType.UPDATE:
        return '更新';
      case UserFormType.REGISTERED:
        return '注册';
      default:
        throw Error(nonsupportMsg);
    }
  }

  function handleModalCancel() {
    form.resetFields();
    onCancel();
  }

  return (
    <Modal
      destroyOnClose
      width={900}
      title={getTitle()}
      visible={visible}
      onCancel={() => handleModalCancel()}
      footer={[
        <Button key="back" onClick={() => handleModalCancel()}>
          取消
        </Button>,
        <Button loading={submitButtonLoading} key="submit" type="primary" htmlType="submit" onClick={handleSubmit}>
          {getSubmitButtonName()}
        </Button>,
      ]}
    >
      <Form form={form} name='userForm' labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label='用户名' name='username' rules={[{ required: true }]}>
              <Input placeholder='请输入用户名' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='性别' name='gender' rules={[{ required: true, message: '请选择性别' }]}>
              <Select
                placeholder="请选择"
                allowClear
              >
                <Option value="MALE">男</Option>
                <Option value="FEMALE">女</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label='密码' name='secretCode' rules={[{ required: true }]}>
              <Input.Password placeholder='请输入密码' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='确认密码' name='confirmSecretCode'
                       rules={[
                         { required: true, message: '请确认密码' },
                         ({ getFieldValue }) => ({
                           validator(rule, value) {
                             if (!value || getFieldValue('secretCode') === value) {
                               return Promise.resolve();
                             }
                             return Promise.reject(new Error('两次输入的密码不匹配！'));
                           },
                         }),
                       ]}>
              <Input.Password placeholder='请确认密码' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label='手机号' name='phoneNumber' rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}>
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='邮箱' name='emailAddress' rules={[{ type: 'email' }]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label='是否锁定' name='accountLocked'>
              <Select
                placeholder="请选择"
                allowClear
              >
                <Option value="YES">是</Option>
                <Option value="NO">否</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='账号是否到期' name='accountExpired'>
              <Select
                placeholder="请选择"
                allowClear
              >
                <Option value="YES">是</Option>
                <Option value="NO">否</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label='账号是否启用' name='enabled'>
              <Select
                placeholder="请选择"
                allowClear
              >
                <Option value="YES">是</Option>
                <Option value="NO">否</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='密码是否过期' name='credentialsExpired'>
              <Select
                placeholder="请选择"
                allowClear
              >
                <Option value="YES">是</Option>
                <Option value="NO">否</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserForm;
