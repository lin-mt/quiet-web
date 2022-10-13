import React, { useEffect, useState } from 'react';
import {
  Form,
  Grid,
  Input,
  Modal,
  Select,
  Switch,
} from '@arco-design/web-react';
import { QuietUser } from '@/service/system/type';
import { enabled, expired, locked } from '@/utils/render';
import RoleTreeSelect from '@/components/RoleTreeSelect';
import { QuietFormProps } from '@/components/type';

const Row = Grid.Row;
const Col = Grid.Col;
const { useForm } = Form;

export type UserFormProps = QuietFormProps<QuietUser> & {
  accountConfigVisible?: boolean;
};

function UserForm(props: UserFormProps) {
  const { accountConfigVisible = false } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(props.formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.formValues)]);

  function handleOk() {
    if (props.onOk) {
      form.validate().then(async (values) => {
        setSubmitting(true);
        props.onOk(values, form.getFieldValue('authorities')).finally(() => {
          setSubmitting(false);
        });
      });
    } else {
      form.resetFields();
    }
  }

  function handleCancel() {
    if (props.onCancel) {
      props.onCancel();
    } else {
      form.resetFields();
    }
  }

  return (
    <Modal
      style={{ width: 1000 }}
      title={props.title}
      visible={props.visible}
      onOk={handleOk}
      okText={props.okText}
      onCancel={handleCancel}
      cancelText={props.cancelText}
      afterClose={() => {
        form.resetFields();
      }}
      confirmLoading={submitting}
    >
      <Form
        form={form}
        id={'user-form'}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Row gutter={20}>
          <Col span={8}>
            <Form.Item
              label="用户名"
              field="username"
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
              field="full_name"
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
              field="gender"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Select placeholder="请选择">
                <Select.Option value="MALE">男</Select.Option>
                <Select.Option value="FEMALE">女</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="密码"
              field="secret_code"
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
              field="confirm_secret_code"
              rules={[
                { required: true, message: '请确认密码' },
                {
                  validator: async (value, callback) => {
                    return new Promise((resolve) => {
                      if (value !== form.getFieldValue('secret_code')) {
                        callback('两次输入的密码不匹配');
                      }
                      resolve();
                    });
                  },
                },
              ]}
            >
              <Input.Password placeholder="请确认密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="手机号"
              field="phone_number"
              rules={[
                {
                  required: true,
                  message: '请输入手机号',
                },
                {
                  match: /^1\d{10}$/,
                  message: '手机号格式错误',
                },
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="联系邮箱"
              field="email_address"
              rules={[{ type: 'email', message: '邮箱格式不正确' }]}
            >
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>
          </Col>
          {accountConfigVisible && (
            <>
              <Col span={24}>
                <Form.Item
                  label={'用户角色'}
                  field={'authorities'}
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                  formatter={(value) => {
                    return value.map((u) => (typeof u === 'string' ? u : u.id));
                  }}
                >
                  <RoleTreeSelect
                    multiple
                    showSearch
                    allowClear
                    placeholder={'请选择用户角色'}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="账号状态"
                  field={'account_locked'}
                  initialValue={true}
                  triggerPropName={'checked'}
                >
                  <Switch
                    checkedText={locked(true)}
                    uncheckedText={locked(false)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="账号期限"
                  field="account_expired"
                  initialValue={true}
                  triggerPropName={'checked'}
                >
                  <Switch
                    checkedText={expired(true)}
                    uncheckedText={expired(false)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="账号状态"
                  field="enabled"
                  initialValue={true}
                  triggerPropName={'checked'}
                >
                  <Switch
                    checkedText={enabled(true)}
                    uncheckedText={enabled(false)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="密码期限"
                  field="credentials_expired"
                  initialValue={true}
                  triggerPropName={'checked'}
                >
                  <Switch
                    checkedText={expired(true)}
                    uncheckedText={expired(false)}
                  />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </Modal>
  );
}

export default UserForm;
