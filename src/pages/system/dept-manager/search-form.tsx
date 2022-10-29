import React from 'react';
import { Form, Input, Button, Grid } from '@arco-design/web-react';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';

const { Row, Col } = Grid;
const { useForm } = Form;

function SearchForm(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item label={'部门ID'} field="id">
              <Input allowClear placeholder={'请输入部门ID'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'部门名称'} field="dept_name">
              <Input allowClear placeholder={'请输入部门名称'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'父级部门ID'} field="parent_id">
              <Input allowClear placeholder={'请输入父级部门ID'} />
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
