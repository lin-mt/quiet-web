import React from 'react';
import { Form, Input, Button, Grid, Select } from '@arco-design/web-react';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { booleanOptions } from '@/utils/render';

const { Row, Col } = Grid;
const { useForm } = Form;

function SearchForm(props: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onSearch: (values: Record<string, any>) => void;
}) {
  const [form] = useForm();

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
      <Form
        form={form}
        className={styles['search-form']}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item label={'模板ID'} field="id">
              <Input allowClear placeholder={'请输入模板ID'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'模板名称'} field="name">
              <Input allowClear placeholder={'请输入模板名称'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'状态'} field="enabled">
              <Select
                allowClear
                placeholder={'请选择状态'}
                options={booleanOptions('启用', '禁用')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          查询
        </Button>
        <Button
          className={styles['reset-button']}
          icon={<IconRefresh />}
          onClick={handleReset}
        >
          重置
        </Button>
      </div>
    </div>
  );
}

export default SearchForm;
