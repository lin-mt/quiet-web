import React, { useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { queryUser, registeredUser, updateUser } from '@/services/system/QuiteUser';
import UserForm from './components/UserForm';

const { Option } = Select;

const TableList: React.FC<{}> = () => {
  const [userForm] = Form.useForm();
  const [backUpdateUser, setBackUpdateUser] = useState<SystemEntities.QuiteUser>();
  const [userModalVisible, handleUserModalVisible] = useState<boolean>(false);
  const [userModalType, handleUserModalType] = useState<'create' | 'update'>('create');
  const userModalActionRef = useRef<ActionType>();
  const columns: ProColumns<SystemEntities.QuiteUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'text',
    },
    {
      title: '密码',
      dataIndex: 'secretCode',
      valueType: 'text',
      search: false,
      hideInTable: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'avatar',
      search: false,
      hideInForm: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      renderText: (gender) => {
        return gender?.value;
      },
    },
    {
      title: '电话号码',
      dataIndex: 'phoneNumber',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'emailAddress',
      valueType: 'text',
    },
    {
      title: '账号是否到期',
      filters: true,
      dataIndex: 'accountExpired',
      renderText: (accountExpired) => {
        return accountExpired?.value;
      },
      hideInForm: true,
    },
    {
      title: '账号是否被锁',
      dataIndex: 'accountLocked',
      renderText: (accountLocked) => {
        return accountLocked?.value;
      },
    },
    {
      title: '密码是否过期',
      dataIndex: 'credentialsExpired',
      renderText: (credentialsExpired) => {
        return credentialsExpired?.value;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      valueType: 'dateTime',
      search: false,
      hideInForm: true,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtUpdate',
      valueType: 'dateTime',
      search: false,
      hideInForm: true,
    },
    {
      title: '账号是否启用',
      dataIndex: 'enabled',
      renderText: (enabled) => {
        return enabled.value;
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      render: (_, record) => {
        return <a key='update' onClick={() => {
          const updateUserInfo = {
            ...record,
            gender: record.gender?.code,
            accountExpired: record.accountExpired?.code,
            accountLocked: record.accountLocked?.code,
            credentialsExpired: record.credentialsExpired?.code,
            enabled: record.enabled?.code,
          };
          setBackUpdateUser(updateUserInfo);
          userForm.setFieldsValue(updateUserInfo);
          handleUserModalType('update');
          handleUserModalVisible(true);
        }}>修改</a>;
      },
    },
  ];

  const handleSubmit = async () => {
    const values = await userForm.validateFields();
    switch (userModalType) {
      case 'create':
        await registeredUser(values);
        break;
      case 'update':
        await updateUser({ ...backUpdateUser, ...values });
        break;
      default:
        break;
    }
    handleUserModalVisible(false);
    if (typeof userModalActionRef.current !== 'undefined') {
      userModalActionRef.current.reload();
    }
  };

  const handleUserModal = (type: 'create' | 'update') => {
    handleUserModalType(type);
    handleUserModalVisible(true);
  };

  return (
    <PageContainer>
      <ProTable<SystemEntities.QuiteUser>
        actionRef={userModalActionRef}
        rowKey={record => record.id}
        request={(params, sorter, filter) =>
          queryUser({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={() => handleUserModal('create')}>
            <PlusOutlined /> 新建用户
          </Button>,
        ]}
        columns={columns}
      />
      <UserForm onSubmit={() => handleSubmit()} onCancel={() => handleUserModalVisible(false)}
                modalVisible={userModalVisible} type={userModalType}>
        <Form form={userForm} name='createUser' labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
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
      </UserForm>
    </PageContainer>
  );
};

export default TableList;
