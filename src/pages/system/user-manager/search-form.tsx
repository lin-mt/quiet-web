import React from 'react';
import { Form, Input, Button, Grid, Select } from '@arco-design/web-react';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { booleanOptions, enabled, expired, locked } from '@/utils/render';
import { QuietUser } from '@/service/system/type';

const { Row, Col } = Grid;
const { useForm } = Form;

function SearchForm(props: {
  onSearch: (values: Record<string, any>) => void;
}) {
  const [form] = useForm<QuietUser>();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    props.onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    props.onSearch({});
  };

  const colSpan = 6;

  return (
    <div className={styles['search-form-wrapper']}>
      <Form<QuietUser>
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item label={'用户ID'} field="id">
              <Input placeholder={'请输入用户ID'} allowClear />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'用户名'} field="username">
              <Input allowClear placeholder={'请输入用户名'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'姓名'} field="full_name">
              <Input allowClear placeholder={'请输入姓名'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'电话号码'} field="phone_number">
              <Input allowClear placeholder={'请输入电话号码'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'账号期限'} field="account_expired">
              <Select
                allowClear
                placeholder={'请选择账号期限'}
                options={booleanOptions(expired(true), expired(false))}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'账号状态'} field="account_locked">
              <Select
                allowClear
                placeholder={'请选择账号状态'}
                options={booleanOptions(locked(true), locked(false))}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'密码期限'} field="credentials_expired">
              <Select
                allowClear
                placeholder={'请选择密码期限'}
                options={booleanOptions(expired(true), expired(false))}
              />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'启用状态'} field="enabled">
              <Select
                allowClear
                placeholder={'请选择启用状态'}
                options={booleanOptions(enabled(true), enabled(false))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          查询
        </Button>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;
