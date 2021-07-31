import { ApiTitle } from '@/pages/doc/project/detail';
import { Col, Form, Input, InputNumber, Radio, Row, Select, Space } from 'antd';
import type { ApiDetail } from '@/services/doc/EntityType';
import styled from 'styled-components';
import { DebounceSelect } from '@/pages/components/DebounceSelect';
import { listApiGroupByProjectIdAndName } from '@/services/doc/DocApiGroup';
import type { RadioChangeEvent } from 'antd/lib/radio/interface';
import { Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface ApiEditProps {
  apiId: string;
  projectId: string;
  apiDetail?: ApiDetail;
}

const EditContainer = styled.div`
  border-radius: 6px;
  background: rgba(230, 233, 236, 0.67);
  width: 100%;
  padding: 16px;
`;

const FieldFormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

export default (props: ApiEditProps) => {
  const { apiDetail, projectId } = props;

  function listApiGroupByName(name: string) {
    return listApiGroupByProjectIdAndName(projectId, name).then((resp) => {
      return resp.map((apiGroup) => ({
        label: apiGroup.name,
        value: apiGroup.id,
      }));
    });
  }

  function handleRequestTypeChange(event: RadioChangeEvent) {
    // eslint-disable-next-line no-console
    console.log(event.target.value);
  }

  return (
    <Form
      name={'apiEdit'}
      labelCol={{ span: 5 }}
      initialValues={{
        name: apiDetail?.api.name,
        apiState: apiDetail?.api.apiState && 'UNFINISHED',
        method: apiDetail?.api.method && 'GET',
        url: apiDetail?.api.url,
        apiGroupId: apiDetail?.api.apiGroup
          ? {
              value: apiDetail?.api.apiGroup.id,
              label: apiDetail?.api.apiGroup.name,
            }
          : undefined,
      }}
    >
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <ApiTitle>基本设置</ApiTitle>
        <EditContainer style={{ paddingLeft: 300, paddingRight: 300 }}>
          <FieldFormItem
            label={'接口名称'}
            name={'name'}
            rules={[
              { required: true, message: '请输入接口名称' },
              { len: 30, message: '接口名称长度不能超过 30' },
            ]}
          >
            <Input placeholder={'请输入接口名称'} />
          </FieldFormItem>
          <FieldFormItem label={'分组'} name={'apiGroupId'}>
            <DebounceSelect
              allowClear={true}
              placeholder="请输入分组名称"
              fetchOptions={listApiGroupByName}
            />
          </FieldFormItem>
          <FieldFormItem
            label={'接口路径'}
            name={'url'}
            rules={[
              { required: true, message: '请输入接口地址' },
              { max: 300, message: '接口地址长度不能超过 300', type: 'string' },
            ]}
          >
            <Input
              addonBefore={
                <Form.Item name="method" noStyle>
                  <Select style={{ width: 96 }}>
                    <Select.Option value={'GET'}>GET</Select.Option>
                    <Select.Option value={'HEAD'}>HEAD</Select.Option>
                    <Select.Option value={'POST'}>POST</Select.Option>
                    <Select.Option value={'PUT'}>PUT</Select.Option>
                    <Select.Option value={'DELETE'}>DELETE</Select.Option>
                    <Select.Option value={'OPTIONS'}>OPTIONS</Select.Option>
                    <Select.Option value={'PATCH'}>PATCH</Select.Option>
                  </Select>
                </Form.Item>
              }
              placeholder="请输入接口路径"
            />
          </FieldFormItem>
          <FieldFormItem
            label={'状态'}
            name={'apiState'}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: '请选择接口状态' }]}
          >
            <Select>
              <Select.Option value={'UNFINISHED'}>未完成</Select.Option>
              <Select.Option value={'FINISH'}>已完成</Select.Option>
            </Select>
          </FieldFormItem>
        </EditContainer>
        <ApiTitle>请求参数设置</ApiTitle>
        <Radio.Group
          style={{ textAlign: 'center', width: '100%' }}
          options={['Body', 'Query', 'Headers']}
          defaultValue={'Body'}
          optionType={'button'}
          buttonStyle={'solid'}
          onChange={handleRequestTypeChange}
        />
        <EditContainer>
          <Radio.Group
            style={{ textAlign: 'left', paddingBottom: 12 }}
            options={['form', 'json', 'file', 'raw']}
            defaultValue={'form'}
          />
          <Form.List name="apiFormData">
            {(fields, { add, remove }) => (
              <>
                <FieldFormItem>
                  <Button
                    type="primary"
                    size={'small'}
                    onClick={() => add({ required: 'true', type: 'TEXT' })}
                    icon={<PlusOutlined />}
                  >
                    添加form参数
                  </Button>
                </FieldFormItem>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row key={key} gutter={10} style={{ display: 'flex', alignItems: 'baseline' }}>
                    <Col flex={1}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[{ required: true, message: '请输入参数名称' }]}
                      >
                        <Input placeholder="参数名称" />
                      </FieldFormItem>
                    </Col>
                    <Col style={{ width: '92px' }}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'required']}
                        fieldKey={[fieldKey, 'required']}
                        rules={[{ required: true, message: '请选择是否必须' }]}
                      >
                        <Select style={{ width: '85px' }}>
                          <Select.Option value={'true'}>必需</Select.Option>
                          <Select.Option value={'false'}>非必需</Select.Option>
                        </Select>
                      </FieldFormItem>
                    </Col>
                    <Col flex={'92px'}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'type']}
                        fieldKey={[fieldKey, 'type']}
                        rules={[{ required: true, message: '请选择参数类型' }]}
                      >
                        <Select style={{ width: '92px' }}>
                          <Select.Option value={'TEXT'}>text</Select.Option>
                          <Select.Option value={'FILE'}>file</Select.Option>
                        </Select>
                      </FieldFormItem>
                    </Col>
                    <Col flex={'100px'}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'mixLength']}
                        fieldKey={[fieldKey, 'mixLength']}
                        rules={[{ min: 0, type: 'number', message: '最小长度不能小于 0' }]}
                      >
                        <InputNumber min={0} style={{ width: 100 }} placeholder="最小长度" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={'100px'}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'maxLength']}
                        fieldKey={[fieldKey, 'maxLength']}
                        rules={[{ min: 0, type: 'number', message: '最大长度不能小于 0' }]}
                      >
                        <InputNumber min={0} style={{ width: 100 }} placeholder="最大长度" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={1}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'example']}
                        fieldKey={[fieldKey, 'example']}
                        rules={[{ len: 300, type: 'string', message: '参数示例长度不能超过 300' }]}
                      >
                        <Input placeholder="参数示例" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={1}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'remark']}
                        fieldKey={[fieldKey, 'remark']}
                        rules={[{ len: 300, type: 'string', message: '备注长度不能超过 300' }]}
                      >
                        <Input style={{ width: '100%' }} placeholder="备注" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={'22px'}>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Col>
                    <FieldFormItem
                      {...restField}
                      hidden={true}
                      name={[name, 'apiId']}
                      fieldKey={[fieldKey, 'apiId']}
                    >
                      <Input value={apiDetail?.api.id} />
                    </FieldFormItem>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
        </EditContainer>
        <EditContainer style={{ paddingTop: 12, paddingBottom: 12 }}>
          <Form.List name="apiQuery">
            {(fields, { add, remove }) => (
              <>
                <FieldFormItem>
                  <Button
                    type="primary"
                    size={'small'}
                    onClick={() => add({ required: 'true', type: 'STRING' })}
                    icon={<PlusOutlined />}
                  >
                    添加Query参数
                  </Button>
                </FieldFormItem>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row key={key} gutter={10} style={{ display: 'flex', alignItems: 'baseline' }}>
                    <Col flex={1}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[{ required: true, message: '请输入参数名称' }]}
                      >
                        <Input placeholder="参数名称" />
                      </FieldFormItem>
                    </Col>
                    <Col style={{ width: '92px' }}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'required']}
                        fieldKey={[fieldKey, 'required']}
                        rules={[{ required: true, message: '请选择是否必须' }]}
                      >
                        <Select style={{ width: '85px' }}>
                          <Select.Option value={'true'}>必需</Select.Option>
                          <Select.Option value={'false'}>非必需</Select.Option>
                        </Select>
                      </FieldFormItem>
                    </Col>
                    <Col flex={'92px'}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'type']}
                        fieldKey={[fieldKey, 'type']}
                        rules={[{ required: true, message: '请选择参数类型' }]}
                      >
                        <Select style={{ width: '92px' }}>
                          <Select.Option value={'STRING'}>string</Select.Option>
                          <Select.Option value={'NUMBER'}>number</Select.Option>
                          <Select.Option value={'INTEGER'}>int</Select.Option>
                        </Select>
                      </FieldFormItem>
                    </Col>
                    <Col flex={'100px'}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'mixLength']}
                        fieldKey={[fieldKey, 'mixLength']}
                        rules={[{ min: 0, type: 'number', message: '最小长度不能小于 0' }]}
                      >
                        <InputNumber min={0} style={{ width: 100 }} placeholder="最小长度" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={'100px'}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'maxLength']}
                        fieldKey={[fieldKey, 'maxLength']}
                        rules={[{ min: 0, type: 'number', message: '最大长度不能小于 0' }]}
                      >
                        <InputNumber min={0} style={{ width: 100 }} placeholder="最大长度" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={1}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'example']}
                        fieldKey={[fieldKey, 'example']}
                        rules={[{ len: 300, type: 'string', message: '参数示例长度不能超过 300' }]}
                      >
                        <Input placeholder="参数示例" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={1}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'remark']}
                        fieldKey={[fieldKey, 'remark']}
                        rules={[{ len: 300, type: 'string', message: '备注长度不能超过 300' }]}
                      >
                        <Input style={{ width: '100%' }} placeholder="备注" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={'22px'}>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Col>
                    <FieldFormItem
                      {...restField}
                      hidden={true}
                      name={[name, 'apiId']}
                      fieldKey={[fieldKey, 'apiId']}
                    >
                      <Input value={apiDetail?.api.id} />
                    </FieldFormItem>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
        </EditContainer>
        <EditContainer style={{ paddingTop: 12, paddingBottom: 12 }}>
          <Form.List name="apiHeader">
            {(fields, { add, remove }) => (
              <>
                <FieldFormItem>
                  <Button
                    type="primary"
                    size={'small'}
                    onClick={() => add({ required: 'true' })}
                    icon={<PlusOutlined />}
                  >
                    添加Header
                  </Button>
                </FieldFormItem>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row key={key} gutter={10} style={{ display: 'flex', alignItems: 'baseline' }}>
                    <Col flex={1}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[{ required: true, message: '请输入参数名称' }]}
                      >
                        <Input placeholder="参数名称" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={1}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'value']}
                        fieldKey={[fieldKey, 'value']}
                        rules={[{ len: 30, message: '参数值长度不能超过 30' }]}
                      >
                        <Input placeholder="参数值" />
                      </FieldFormItem>
                    </Col>
                    <Col style={{ width: '92px' }}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'required']}
                        fieldKey={[fieldKey, 'required']}
                        rules={[{ required: true, message: '请选择是否必须' }]}
                      >
                        <Select style={{ width: '85px' }}>
                          <Select.Option value={'true'}>必需</Select.Option>
                          <Select.Option value={'false'}>非必需</Select.Option>
                        </Select>
                      </FieldFormItem>
                    </Col>
                    <Col flex={1}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'example']}
                        fieldKey={[fieldKey, 'example']}
                        rules={[{ len: 300, type: 'string', message: '参数示例长度不能超过 300' }]}
                      >
                        <Input placeholder="参数示例" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={1}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'remark']}
                        fieldKey={[fieldKey, 'remark']}
                        rules={[{ len: 300, type: 'string', message: '备注长度不能超过 300' }]}
                      >
                        <Input style={{ width: '100%' }} placeholder="备注" />
                      </FieldFormItem>
                    </Col>
                    <Col flex={'22px'}>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Col>
                    <FieldFormItem
                      {...restField}
                      hidden={true}
                      name={[name, 'apiId']}
                      fieldKey={[fieldKey, 'apiId']}
                    >
                      <Input value={apiDetail?.api.id} />
                    </FieldFormItem>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
        </EditContainer>
        <ApiTitle>返回数据设置</ApiTitle>
        <div>这是返回数据设置区域</div>
        <ApiTitle>备 注</ApiTitle>
        <div>这是备注编辑区域</div>
      </Space>
    </Form>
  );
};
