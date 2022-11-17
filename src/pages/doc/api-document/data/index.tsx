import React, { useContext } from 'react';
import {
  Button,
  Card,
  Form,
  Grid,
  Input,
  Switch,
} from '@arco-design/web-react';
import {
  ApiManagerContext,
  ApiManagerContextProps,
} from '@/pages/doc/api-document';
import { updateSwaggerConfig } from '@/service/doc/project';

const { Row, Col } = Grid;

function Data() {
  const { projectInfo, setProjectInfo } =
    useContext<ApiManagerContextProps>(ApiManagerContext);
  const [dataFrom] = Form.useForm();
  const swaggerEnabled = Form.useWatch('swagger_enabled', dataFrom);

  function handleSubmit(values) {
    console.log(values);
    updateSwaggerConfig('1', true, 'url', 'corn');
  }

  return (
    <Card>
      <Row gutter={30}>
        <Col span={12}>
          <Form form={dataFrom} onSubmit={handleSubmit}>
            <Form.Item label={'Swagger 配置'} />
            <Form.Item label={'是否启用'} field={'swagger_enabled'}>
              <Switch />
            </Form.Item>
            <Form.Item
              label={'地址'}
              field={'swagger_url'}
              rules={[
                { required: swaggerEnabled, message: '请输入 Swagger 地址' },
              ]}
            >
              <Input placeholder={'请输入 Swagger 地址'} />
            </Form.Item>
            <Form.Item
              label={'Cron'}
              field={'swagger_cron'}
              rules={[
                { required: swaggerEnabled, message: '请输入同步表达式' },
              ]}
            >
              <Input placeholder={'请输入同步表达式'} />
            </Form.Item>
            <Form.Item label={' '}>
              <Button type="primary" htmlType={'submit'}>
                保 存
              </Button>
              <Button
                style={{ marginLeft: 24 }}
                onClick={() => {
                  dataFrom.resetFields();
                }}
              >
                重 置
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
}

export default Data;
