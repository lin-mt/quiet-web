import React, { useEffect } from 'react';
import { DocProjectEnv, HttpProtocol } from '@/service/doc/type';
import {
  AutoComplete,
  Button,
  Form,
  Grid,
  Input,
  Select,
} from '@arco-design/web-react';
import { enumToSelectOptions } from '@/utils/render';
import { REQUEST_HEADER } from '@/pages/doc/api-manager/api/api-detail/constent';
import { IconDelete, IconPlus, IconSave } from '@arco-design/web-react/icon';
const { useForm } = Form;
const { Row, Col } = Grid;

export type EnvFormProps = {
  envInfo: DocProjectEnv;
  onSubmit: (info: DocProjectEnv) => Promise<DocProjectEnv>;
};

function EnvForm(props: EnvFormProps) {
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(props.envInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.envInfo)]);

  function handleOnSubmit() {
    form.validate().then((value) => {
      props.onSubmit(value).then((newEnv) => {
        form.setFieldsValue(newEnv);
      });
    });
  }

  return (
    <Form
      form={form}
      layout={'vertical'}
      style={{ width: 900 }}
      onSubmit={handleOnSubmit}
    >
      <Form.Item hidden field={'id'}>
        <Input />
      </Form.Item>
      <Form.Item hidden field={'project_id'}>
        <Input />
      </Form.Item>
      <Form.Item
        field={'name'}
        label={'名称'}
        rules={[
          { required: true, message: '环境名称不能为空' },
          { maxLength: 30, message: '环境名称长度不能超过 30' },
        ]}
      >
        <Input placeholder={'请输入名称'} />
      </Form.Item>
      <Form.Item
        field={'domain'}
        label={'域名'}
        rules={[
          { required: true, message: '域名不能为空' },
          { maxLength: 90, message: '域名长度不能超过 90' },
        ]}
      >
        <Input
          placeholder={'请输入域名'}
          addBefore={
            <Form.Item
              noStyle={{ showErrorTip: true }}
              field={'protocol'}
              initialValue={'HTTP'}
            >
              <Select
                style={{ width: 90 }}
                options={enumToSelectOptions(HttpProtocol)}
              />
            </Form.Item>
          }
        />
      </Form.Item>
      <Form.Item label={'Header'}>
        <Form.List field={'headers'}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((item) => (
                <Form.Item style={{ marginBottom: 10 }} key={item.key}>
                  <Row gutter={10} align={'center'}>
                    <Col flex={2}>
                      <Form.Item
                        noStyle
                        rules={[{ required: true }]}
                        field={item.field + '.name'}
                      >
                        <AutoComplete
                          placeholder={'请输入 header 名称'}
                          data={REQUEST_HEADER}
                        />
                      </Form.Item>
                    </Col>
                    <Col flex={5}>
                      <Form.Item
                        noStyle
                        rules={[{ required: true }]}
                        field={item.field + '.value'}
                      >
                        <Input placeholder={'请输入 header 值'} />
                      </Form.Item>
                    </Col>
                    <Col flex={'30px'}>
                      <Button
                        type={'secondary'}
                        status={'danger'}
                        icon={<IconDelete />}
                        onClick={() => remove(item.key)}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Button
                size={'small'}
                type={'primary'}
                icon={<IconPlus />}
                onClick={() => add({ name: '', value: '' })}
              >
                添加请求头
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item label={'Cookie'}>
        <Form.List field={'cookies'}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((item) => (
                <Form.Item style={{ marginBottom: 10 }} key={item.key}>
                  <Row gutter={10} align={'center'}>
                    <Col flex={2}>
                      <Form.Item
                        noStyle
                        rules={[{ required: true }]}
                        field={item.field + '.name'}
                      >
                        <Input placeholder={'请输入 cookie 名称'} />
                      </Form.Item>
                    </Col>
                    <Col flex={5}>
                      <Form.Item
                        noStyle
                        rules={[{ required: true }]}
                        field={item.field + '.value'}
                      >
                        <Input placeholder={'请输入 cookie 值'} />
                      </Form.Item>
                    </Col>
                    <Col flex={'30px'}>
                      <Button
                        type={'secondary'}
                        status={'danger'}
                        icon={<IconDelete />}
                        onClick={() => remove(item.key)}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Button
                size={'small'}
                type={'primary'}
                icon={<IconPlus />}
                onClick={() => add({ name: '', value: '' })}
              >
                添加 Cookie
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" icon={<IconSave />}>
          保存
        </Button>
      </Form.Item>
    </Form>
  );
}

export default EnvForm;
