import React, { useContext, useEffect } from 'react';
import {
  Button,
  Card,
  Form,
  Grid,
  Input,
  Switch,
  Tooltip,
} from '@arco-design/web-react';
import {
  ApiManagerContext,
  ApiManagerContextProps,
} from '@/pages/doc/api-document';
import { updateSwaggerConfig } from '@/service/doc/project';
import { IconExclamationCircle } from '@arco-design/web-react/icon';

const { Row, Col } = Grid;

function Data() {
  const { projectInfo, setProjectInfo } =
    useContext<ApiManagerContextProps>(ApiManagerContext);
  const [dataFrom] = Form.useForm();
  const swaggerEnabled = Form.useWatch('enabled', dataFrom);

  useEffect(() => {
    initFormValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(projectInfo)]);

  function initFormValue() {
    dataFrom.setFieldsValue({
      enabled: projectInfo.swagger_enabled,
      url: projectInfo.swagger_url,
      cron: projectInfo.swagger_cron,
    });
  }

  function handleSubmit(values) {
    updateSwaggerConfig(
      projectInfo.id,
      values.enabled,
      values.url,
      values.cron
    ).then((resp) => setProjectInfo(resp));
  }

  return (
    <Card>
      <Row gutter={30}>
        <Col span={12}>
          <Form form={dataFrom} onSubmit={handleSubmit}>
            <Form.Item
              label={
                <span>
                  Swagger 配置{' '}
                  <Tooltip content={'仅支持 OpenApi 3.0'}>
                    <IconExclamationCircle />
                  </Tooltip>
                </span>
              }
            />
            <Form.Item
              label={'是否启用'}
              field={'enabled'}
              triggerPropName={'checked'}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label={'地址'}
              field={'url'}
              hidden={!swaggerEnabled}
              rules={[
                { required: swaggerEnabled, message: '请输入 Swagger 地址' },
              ]}
            >
              <Input placeholder={'请输入 Swagger 地址'} />
            </Form.Item>
            <Form.Item
              label={'同步频率'}
              field={'cron'}
              hidden={!swaggerEnabled}
              rules={[
                { required: swaggerEnabled, message: '请输入 Cron 表达式' },
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
                onClick={() => initFormValue()}
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
