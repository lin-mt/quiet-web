import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { saveClient, updateClient } from '@/services/system/QuietClient';
import type { FormInstance } from 'antd/lib/form';
import { OperationType } from '@/types/Type';
import multipleSelectTagRender from '@/utils/RenderUtils';

type ClientFormProps = {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  operationType?: OperationType;
  updateInfo?: SystemEntities.QuietClient;
  afterAction?: () => void;
};

const ClientForm: React.FC<ClientFormProps> = (props) => {
  const { visible, onCancel, operationType, updateInfo, form, afterAction } = props;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [inputForSelectValues, setInputForSelectValues] = useState<string[]>();
  const [scope, setScope] = useState<{ key: string; value: string; label: string }[]>(
    form.getFieldValue('scope')?.map((scopeValue: string) => {
      return { value: scopeValue, label: scopeValue };
    }),
  );
  const [authorizedGrantTypes, setAuthorizedGrantTypes] = useState<
    { key: string; value: string; label: string }[]
  >(
    form.getFieldValue('authorizedGrantTypes')?.map((authorizedGrantType: string) => {
      return { value: authorizedGrantType, label: authorizedGrantType };
    }),
  );
  const nonsupportMsg = 'nonsupport FormType';

  async function handleSubmit() {
    const values = await form.validateFields();
    setSubmitting(true);
    const submitValues = {
      ...values,
      scope: scope?.map((scopeValue) => {
        return scopeValue.value;
      }),
      authorizedGrantTypes: authorizedGrantTypes?.map((authorizedGrantType) => {
        return authorizedGrantType.value;
      }),
    };
    switch (operationType) {
      case OperationType.CREATE:
        await saveClient(submitValues);
        break;
      case OperationType.UPDATE:
        await updateClient({
          ...updateInfo,
          ...submitValues,
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
        return '新建客户端';
      case OperationType.UPDATE:
        return '更新客户端';
      default:
        throw Error(nonsupportMsg);
    }
  }

  function getSubmitButtonName() {
    switch (operationType) {
      case OperationType.CREATE:
        return '新增';
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

  function buildOptionByInputValue(value: string) {
    setInputForSelectValues([value]);
  }

  function handleScopeChange(value: any) {
    setScope(value);
    setInputForSelectValues([]);
  }

  function handleAuthorizedGrantTypesChange(value: any) {
    setAuthorizedGrantTypes(value);
    setInputForSelectValues([]);
  }

  return (
    <Modal
      destroyOnClose
      width={900}
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
      <Form form={form} name={'clientForm'} labelCol={{ span: 9 }}>
        <Row>
          <Col span={12}>
            <Form.Item
              label={'客户端ID'}
              name={'clientId'}
              rules={[
                { required: true, message: '请输入客户端ID' },
                { max: 30, message: '客户端ID长度不能超过 20' },
              ]}
            >
              <Input placeholder="请输入客户端ID" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={'客户端名称'}
              name={'clientName'}
              rules={[
                { required: true, message: '请输入客户端名称' },
                { max: 30, message: '客户端名称长度不能超过 30' },
              ]}
            >
              <Input placeholder="请输入客户端名称" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="客户端密码"
              name="clientSecret"
              rules={[
                { required: true, message: '请输入客户端密码' },
                { min: 5, max: 16, message: '密码长度要在 5 - 16 之间' },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="确认密码"
              name="confirmClientSecret"
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('clientSecret') === value) {
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
        <Row>
          <Col span={12}>
            <Form.Item label="授权范围">
              <Select
                mode="multiple"
                labelInValue
                value={scope}
                tagRender={multipleSelectTagRender}
                placeholder="请输入授权范围"
                filterOption={false}
                onSearch={buildOptionByInputValue}
                onChange={handleScopeChange}
                onBlur={() => setInputForSelectValues([])}
              >
                {inputForSelectValues?.map((value) => (
                  <Select.Option key={value} value={value}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="授权类型">
              <Select
                mode="multiple"
                labelInValue
                value={authorizedGrantTypes}
                tagRender={multipleSelectTagRender}
                placeholder="请输入授权范围"
                filterOption={false}
                onSearch={buildOptionByInputValue}
                onChange={handleAuthorizedGrantTypesChange}
                onBlur={() => setInputForSelectValues([])}
              >
                {inputForSelectValues?.map((value) => (
                  <Select.Option key={value} value={value}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label={'是否需要认证'}
              name={'secretRequired'}
              rules={[{ required: true, message: '请选择是否需要认证' }]}
            >
              <Select placeholder={'请选择'}>
                <Select.Option value={'YES'}>是</Select.Option>
                <Select.Option value={'NO'}>否</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={'是否自动授权'}
              name={'autoApprove'}
              rules={[{ required: true, message: '请选择是否自动授权' }]}
            >
              <Select placeholder={'请选择'}>
                <Select.Option value={'YES'}>是</Select.Option>
                <Select.Option value={'NO'}>否</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label={'是否限制授权范围'}
              name={'scoped'}
              rules={[{ required: true, message: '请选择是否限制授权范围' }]}
            >
              <Select placeholder={'请选择'}>
                <Select.Option value={'YES'}>是</Select.Option>
                <Select.Option value={'NO'}>否</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={'token有效期'}
              name={'accessTokenValiditySeconds'}
              rules={[{ required: true, message: '请输入 token 有效期' }]}
            >
              <Input placeholder={'请输入 token 有效期'} type={'number'} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label={'刷新token的有效期'}
              name={'refreshTokenValiditySeconds'}
              rules={[{ required: true, message: '请输入刷新 token 的有效期' }]}
            >
              <Input placeholder={'请输入刷新 token 的有效期'} type={'number'} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={'备注'}
              name={'remark'}
              rules={[{ max: 100, message: '客户端的备注信息长度不能超过 100' }]}
            >
              <Input placeholder={'请输入备注信息'} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ClientForm;
