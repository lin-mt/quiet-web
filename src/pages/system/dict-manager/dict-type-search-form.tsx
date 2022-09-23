import React from 'react';
import { Form, Input, Button, Grid, Select } from '@arco-design/web-react';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { booleanOptions, enabled } from '@/utils/render';

const { Row, Col } = Grid;
const { useForm } = Form;

function DictTypeSearchForm(props: {
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
    <div className={styles['dict-type-search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
      >
        <Row gutter={10}>
          <Col span={colSpan}>
            <Form.Item label={'字典类型ID'} field="id">
              <Input allowClear placeholder={'请输入字典类型ID'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'服务ID'} field="service_id">
              <Input allowClear placeholder={'请输入服务ID'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'名称'} field="name">
              <Input allowClear placeholder={'请输入名称'} />
            </Form.Item>
          </Col>
          <Col span={colSpan}>
            <Form.Item label={'启用状态'} field="enabled">
              <Select
                allowClear
                options={booleanOptions(enabled(true), enabled(false))}
                placeholder={'请选择启用状态'}
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

export default DictTypeSearchForm;
