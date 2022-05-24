import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select, Switch } from 'antd';
import { registeredUser, updateUser } from '@/services/system/QuietUser';
import type { QuietUser } from '@/services/system/EntityType';

const { Option } = Select;

type UserFormProps = {
  visible: boolean;
  onCancel: () => void;
  isUserRegister: boolean;
  updateInfo?: QuietUser;
  afterAction?: () => void;
};

const UserForm: React.FC<UserFormProps> = (props) => {
  const { visible, onCancel, isUserRegister, updateInfo, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (updateInfo) {
      form.setFieldsValue(updateInfo);
    } else {
      form.setFieldsValue(undefined);
    }
  }, [form, updateInfo]);

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    if (updateInfo) {
      await updateUser({ ...updateInfo, ...values });
    } else {
      values.avatar =
        'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
      await registeredUser(values);
    }
    setSubmitting(false);
    onCancel();
    if (afterAction) {
      afterAction();
    }
  }

  function getTitle() {
    if (updateInfo) {
      return '更新用户';
    }
    return '注册用户';
  }

  function getSubmitButtonName() {
    if (updateInfo) {
      return '更新';
    }
    return '注册';
  }

  function handleModalCancel() {
    form.setFieldsValue(undefined);
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
      <Form form={form} name="userForm" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { max: 10, message: '用户名的长度不能超过 10' },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="姓名"
              name="full_name"
              rules={[
                { required: true, message: '请输入姓名' },
                { max: 10, message: '姓名的长度不能超过 10' },
              ]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="性别"
              name="gender"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Select placeholder="请选择" allowClear>
                <Option value="MALE">男</Option>
                <Option value="FEMALE">女</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="密码"
              name="secret_code"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 5, max: 16, message: '密码长度要在 5 - 16 之间' },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="确认密码"
              name="confirm_secret_code"
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('secret_code') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不匹配！'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="请确认密码" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              label="手机号"
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="联系邮箱"
              name="email_address"
              rules={[{ type: 'email', message: '邮箱格式不正确' }]}
            >
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>
          </Col>
        </Row>
        {!isUserRegister && (
          <>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="是否锁定" name={'account_locked'} valuePropName={'checked'}>
                  <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="账号是否到期" name="account_expired" valuePropName={'checked'}>
                  <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="账号是否启用" name="enabled" valuePropName={'checked'}>
                  <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="密码是否过期"
                  name="credentials_expired"
                  valuePropName={'checked'}
                >
                  <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default UserForm;
