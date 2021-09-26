import { ApiTitle } from '@/pages/doc/project/detail';
import {
  Affix,
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Tooltip,
} from 'antd';
import type { ApiDetail } from '@/services/doc/EntityType';
import styled from 'styled-components';
import { DebounceSelect } from '@/pages/components/DebounceSelect';
import { listApiGroupByProjectIdAndName } from '@/services/doc/DocApiGroup';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { ApiState, FormDataType, HttpMethod, QueryType } from '@/services/doc/Enums';
import _ from 'lodash';
import JsonSchemaEditor from '@/pages/components/JsonSchemaEditor';

interface ApiEditProps {
  apiId: string;
  projectId: string;
  apiDetail: ApiDetail;
}

const EditContainer = styled.div.attrs((props: { hide: boolean }) => props)`
  border-radius: 6px;
  background: rgba(230, 233, 236, 0.67);
  width: 100%;
  padding: 16px;
  display: ${(props) => (props.hide ? 'none' : undefined)};
`;

const SaveContainer = styled.div`
  height: 56px;
  text-align: center;
  padding-top: 12px;
`;

const FieldFormItem = styled(Form.Item)`
  margin-bottom: 16px;
`;

export default (props: ApiEditProps) => {
  const { apiDetail, projectId } = props;
  const [apiDetailForm] = Form.useForm();

  const [reqParamSettingOptions, setReqParamSettingOptions] = useState<string[]>();
  const [reqParamSetting, setReqParamSetting] = useState<string>();
  const [reqJsonBodyJsonSchema, setReqJsonBodyJsonSchema] = useState<string | undefined>();
  const [respSetting, setRespSetting] = useState<string>('JSON');
  const [respJsonSchema, setRespJsonSchema] = useState<string | undefined>();
  const [bodyTypeSetting, setBodyTypeSetting] = useState<string>('form');
  const [affixed, setAffixed] = useState<boolean>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  function getReqParamSettingOptionsByMethod(method: HttpMethod | string): string[] {
    let dump = method;
    if (typeof method === 'string') {
      dump = HttpMethod[method];
    }
    const options = ['Query', 'Headers'];
    if (
      dump === HttpMethod.PUT ||
      dump === HttpMethod.DELETE ||
      dump === HttpMethod.POST ||
      dump === HttpMethod.PATCH
    ) {
      options.unshift('Body');
    }
    return options;
  }

  useEffect(() => {
    apiDetailForm.setFieldsValue({
      name: apiDetail.api.name,
      apiState: ApiState[apiDetail.api.apiState],
      method: HttpMethod[apiDetail.api.method],
      url: apiDetail.api.url,
      apiGroupId: apiDetail?.api.apiGroup
        ? {
            value: apiDetail?.api.apiGroup.id,
            label: apiDetail?.api.apiGroup.name,
          }
        : undefined,
    });
    const options = getReqParamSettingOptionsByMethod(apiDetail.api.method);
    setReqParamSettingOptions(options);
    setReqParamSetting(options[0]);
  }, [
    apiDetail.api.apiGroup,
    apiDetail.api.apiState,
    apiDetail.api.method,
    apiDetail.api.name,
    apiDetail.api.url,
    apiDetailForm,
  ]);

  function listApiGroupByName(name: string) {
    return listApiGroupByProjectIdAndName(projectId, name).then((resp) => {
      return resp.map((apiGroup) => ({
        label: apiGroup.name,
        value: apiGroup.id,
      }));
    });
  }

  const handlePath = (pathParam: string) => {
    let path = _.trim(pathParam);
    if (!path) {
      return path;
    }
    if (path === '/') {
      return '';
    }
    path = path[0] !== '/' ? `/${path}` : path;
    path = path[path.length - 1] === '/' ? path.substr(0, path.length - 1) : path;
    return path;
  };

  function handleApiUrlChange(event: ChangeEvent<HTMLInputElement>) {
    let val = event.target.value;
    const queue: { name: string; example: ''; remark: string; apiId: string }[] = [];
    const insertParams = (name: string) => {
      const findExist = _.find(apiDetailForm.getFieldValue('apiPathParam'), { name });
      if (findExist) {
        queue.push(findExist);
      } else {
        queue.push({ name, example: '', remark: '', apiId: apiDetail.api.id });
      }
    };
    val = handlePath(val);
    if (val && val.indexOf(':') !== -1) {
      const paths = val.split('/');
      let name: string;
      let i: number;
      for (i = 1; i < paths.length; i += 1) {
        if (paths[i][0] === ':') {
          name = paths[i].substr(1);
          insertParams(name);
        }
      }
    }
    const insertParam = (str: any, match: string) => {
      insertParams(match);
    };
    if (val && val.length > 3) {
      // @ts-ignore
      val.replace(/{(.+?)}/g, insertParam);
    }
    apiDetailForm.setFieldsValue({ ...apiDetailForm.getFieldsValue(), apiPathParam: queue });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const values = await apiDetailForm.validateFields();
      values.method = HttpMethod[values.method];
      values.state = ApiState[values.state];
      if (reqJsonBodyJsonSchema) {
        values.apiBody = reqJsonBodyJsonSchema;
      }
      if (respJsonSchema) {
        values.respBody = respJsonSchema;
      }
      // eslint-disable-next-line no-console
      console.log(values);
    } catch (e) {
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  }

  function handleBodyTypeChange(value: string) {
    setBodyTypeSetting(value);
    if (value !== 'json') {
      setReqJsonBodyJsonSchema(undefined);
    }
  }

  return (
    <Form name={'apiEdit'} labelCol={{ span: 4 }} form={apiDetailForm}>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <ApiTitle>基本设置</ApiTitle>
        <EditContainer style={{ paddingLeft: 200, paddingRight: 200 }}>
          <FieldFormItem
            label={'接口名称'}
            name={'name'}
            rules={[
              { required: true, message: '请输入接口名称' },
              { max: 30, message: '接口名称长度不能超过 30' },
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
                  <Select
                    style={{ width: 105 }}
                    onChange={(method: HttpMethod) => {
                      const options: string[] = getReqParamSettingOptionsByMethod(method);
                      setReqParamSettingOptions(options);
                      setReqParamSetting(options[0]);
                    }}
                  >
                    <Select.Option value={HttpMethod.GET}>GET</Select.Option>
                    <Select.Option value={HttpMethod.POST}>POST</Select.Option>
                    <Select.Option value={HttpMethod.PUT}>PUT</Select.Option>
                    <Select.Option value={HttpMethod.DELETE}>DELETE</Select.Option>
                    <Select.Option value={HttpMethod.HEAD}>HEAD</Select.Option>
                    <Select.Option value={HttpMethod.OPTIONS}>OPTIONS</Select.Option>
                    <Select.Option value={HttpMethod.PATCH}>PATCH</Select.Option>
                  </Select>
                </Form.Item>
              }
              placeholder="请输入接口路径"
              onChange={handleApiUrlChange}
            />
          </FieldFormItem>
          <Form.List name="apiPathParam">
            {(fields) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row key={key} gutter={10} style={{ display: 'flex', alignItems: 'baseline' }}>
                    <Col span={4}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'name']}
                        fieldKey={[fieldKey, 'name']}
                        rules={[{ required: true, message: '请输入参数名称' }]}
                      >
                        <Input placeholder="参数名称" disabled={true} />
                      </FieldFormItem>
                    </Col>
                    <Col span={10}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'example']}
                        fieldKey={[fieldKey, 'example']}
                        rules={[{ max: 300, type: 'string', message: '参数示例长度不能超过 300' }]}
                      >
                        <Input placeholder="参数示例" />
                      </FieldFormItem>
                    </Col>
                    <Col span={10}>
                      <FieldFormItem
                        {...restField}
                        name={[name, 'remark']}
                        fieldKey={[fieldKey, 'remark']}
                        rules={[{ max: 300, type: 'string', message: '备注长度不能超过 300' }]}
                      >
                        <Input style={{ width: '100%' }} placeholder="备注" />
                      </FieldFormItem>
                    </Col>
                    <FieldFormItem
                      {...restField}
                      hidden={true}
                      name={[name, 'apiId']}
                      fieldKey={[fieldKey, 'apiId']}
                    >
                      <Input value={apiDetail.api.id} />
                    </FieldFormItem>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
          <FieldFormItem
            label={'状态'}
            name={'apiState'}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: '请选择接口状态' }]}
          >
            <Select>
              <Select.Option value={ApiState.UNFINISHED}>未完成</Select.Option>
              <Select.Option value={ApiState.FINISHED}>已完成</Select.Option>
            </Select>
          </FieldFormItem>
        </EditContainer>
        <ApiTitle style={{ marginTop: 30 }}>请求参数设置</ApiTitle>
        <Radio.Group
          style={{ textAlign: 'center', width: '100%' }}
          options={reqParamSettingOptions}
          defaultValue={reqParamSetting}
          value={reqParamSetting}
          optionType={'button'}
          buttonStyle={'solid'}
          onChange={(event) => setReqParamSetting(event.target.value)}
        />
        <div>
          <EditContainer hide={reqParamSetting !== 'Body'}>
            <Radio.Group
              style={{ textAlign: 'left', paddingBottom: 12 }}
              options={['form', 'json', 'file', 'raw']}
              defaultValue={bodyTypeSetting}
              value={bodyTypeSetting}
              onChange={(e) => handleBodyTypeChange(e.target.value)}
            />
            {bodyTypeSetting === 'form' && (
              <Form.List name="apiFormData">
                {(fields, { add, remove }) => (
                  <>
                    <FieldFormItem>
                      <Button
                        type="primary"
                        size={'small'}
                        onClick={() => add({ required: true, type: FormDataType.TEXT })}
                        icon={<PlusOutlined />}
                      >
                        添加form参数
                      </Button>
                    </FieldFormItem>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Row
                        key={key}
                        gutter={10}
                        style={{ display: 'flex', alignItems: 'baseline' }}
                      >
                        <Col flex={1}>
                          <FieldFormItem
                            {...restField}
                            name={[name, 'name']}
                            fieldKey={[fieldKey, 'name']}
                            rules={[
                              { required: true, message: '请输入参数名称' },
                              { max: 30, message: '参数长度不能超过 30', type: 'string' },
                            ]}
                          >
                            <Input placeholder="参数名称" />
                          </FieldFormItem>
                        </Col>
                        <Col>
                          <FieldFormItem
                            {...restField}
                            name={[name, 'required']}
                            fieldKey={[fieldKey, 'required']}
                            valuePropName={'checked'}
                            rules={[{ required: true, message: '请选择是否必须' }]}
                          >
                            <Tooltip title={'是否必须'}>
                              <Checkbox />
                            </Tooltip>
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
                              <Select.Option value={FormDataType.TEXT}>text</Select.Option>
                              <Select.Option value={FormDataType.FILE}>file</Select.Option>
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
                            rules={[
                              { max: 300, type: 'string', message: '参数示例长度不能超过 300' },
                            ]}
                          >
                            <Input placeholder="参数示例" />
                          </FieldFormItem>
                        </Col>
                        <Col flex={1}>
                          <FieldFormItem
                            {...restField}
                            name={[name, 'remark']}
                            fieldKey={[fieldKey, 'remark']}
                            rules={[{ max: 300, type: 'string', message: '备注长度不能超过 300' }]}
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
                          <Input value={apiDetail.api.id} />
                        </FieldFormItem>
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>
            )}
            {bodyTypeSetting === 'json' && (
              <JsonSchemaEditor
                isMock={true}
                data={reqJsonBodyJsonSchema}
                id={'request-body'}
                onChange={(e) => setReqJsonBodyJsonSchema(e)}
              />
            )}
            {bodyTypeSetting === 'file' && (
              <FieldFormItem noStyle={true} name={'bodyFile'}>
                <Input />
              </FieldFormItem>
            )}
            {bodyTypeSetting === 'raw' && (
              <FieldFormItem
                noStyle={true}
                name={'bodyRaw'}
                rules={[{ max: 30, message: 'RAW 示例不能超过 30' }]}
              >
                <Input.TextArea rows={3} />
              </FieldFormItem>
            )}
          </EditContainer>
          <EditContainer hide={reqParamSetting !== 'Query'}>
            <Form.List name="apiQuery">
              {(fields, { add, remove }) => (
                <>
                  <FieldFormItem>
                    <Button
                      type="primary"
                      size={'small'}
                      onClick={() => add({ required: true, type: QueryType.STRING })}
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
                      <Col>
                        <FieldFormItem
                          {...restField}
                          name={[name, 'required']}
                          fieldKey={[fieldKey, 'required']}
                          valuePropName={'checked'}
                          rules={[{ required: true, message: '请选择是否必须' }]}
                        >
                          <Tooltip title={'是否必须'}>
                            <Checkbox />
                          </Tooltip>
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
                            <Select.Option value={QueryType.STRING}>string</Select.Option>
                            <Select.Option value={QueryType.NUMBER}>number</Select.Option>
                            <Select.Option value={QueryType.INTEGER}>int</Select.Option>
                          </Select>
                        </FieldFormItem>
                      </Col>
                      <Col flex={'100px'}>
                        <FieldFormItem
                          {...restField}
                          name={[name, 'mix']}
                          fieldKey={[fieldKey, 'mix']}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: 130 }}
                            placeholder="最小长度（值）"
                          />
                        </FieldFormItem>
                      </Col>
                      <Col flex={'100px'}>
                        <FieldFormItem
                          {...restField}
                          name={[name, 'max']}
                          fieldKey={[fieldKey, 'max']}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: 130 }}
                            placeholder="最大长度（值）"
                          />
                        </FieldFormItem>
                      </Col>
                      <Col flex={1}>
                        <FieldFormItem
                          {...restField}
                          name={[name, 'example']}
                          fieldKey={[fieldKey, 'example']}
                          rules={[
                            { max: 300, type: 'string', message: '参数示例长度不能超过 300' },
                          ]}
                        >
                          <Input placeholder="参数示例" />
                        </FieldFormItem>
                      </Col>
                      <Col flex={1}>
                        <FieldFormItem
                          {...restField}
                          name={[name, 'remark']}
                          fieldKey={[fieldKey, 'remark']}
                          rules={[{ max: 300, type: 'string', message: '备注长度不能超过 300' }]}
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
                        <Input value={apiDetail.api.id} />
                      </FieldFormItem>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </EditContainer>
          <EditContainer hide={reqParamSetting !== 'Headers'}>
            <Form.List name="apiHeader">
              {(fields, { add, remove }) => (
                <>
                  <FieldFormItem>
                    <Button
                      type="primary"
                      size={'small'}
                      onClick={() => add({ required: true })}
                      icon={<PlusOutlined />}
                    >
                      添加Header
                    </Button>
                  </FieldFormItem>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row key={key} gutter={10} style={{ display: 'flex', alignItems: 'baseline' }}>
                      <Col flex={'220px'}>
                        <FieldFormItem
                          {...restField}
                          name={[name, 'name']}
                          fieldKey={[fieldKey, 'name']}
                          rules={[{ required: true, message: '请输入参数名称' }]}
                        >
                          <AutoComplete
                            placeholder={'参数名称'}
                            options={[
                              { value: 'Accept' },
                              { value: 'Accept-Charset' },
                              { value: 'Accept-Encoding' },
                              { value: 'Accept-Language' },
                              { value: 'Accept-Datetime' },
                              { value: 'Authorization' },
                              { value: 'Cache-Control' },
                              { value: 'Connection' },
                              { value: 'Cookie' },
                              { value: 'Content-Disposition' },
                              { value: 'Content-Length' },
                              { value: 'Content-MD5' },
                              { value: 'Content-Type' },
                              { value: 'Date' },
                              { value: 'Expect' },
                              { value: 'From' },
                              { value: 'Host' },
                              { value: 'If-Match' },
                              { value: 'If-Modified-Since' },
                              { value: 'If-None-Match' },
                              { value: 'If-Range' },
                              { value: 'If-Unmodified-Since' },
                              { value: 'Max-Forwards' },
                              { value: 'Origin' },
                              { value: 'Pragma' },
                              { value: 'Proxy-Authorization' },
                              { value: 'Range' },
                              { value: 'Referer' },
                              { value: 'TE' },
                              { value: 'User-Agent' },
                              { value: 'Upgrade' },
                              { value: 'Via' },
                              { value: 'Warning' },
                              { value: 'X-Requested-With' },
                              { value: 'DNT' },
                              { value: 'X-Forwarded-For' },
                              { value: 'X-Forwarded-Host' },
                              { value: 'X-Forwarded-Proto' },
                              { value: 'Front-End-Https' },
                              { value: 'X-Http-Method-Override' },
                              { value: 'X-ATT-DeviceId' },
                              { value: 'X-Wap-Profile' },
                              { value: 'Proxy-Connection' },
                              { value: 'X-UIDH' },
                              { value: 'X-Csrf-Token' },
                            ]}
                          />
                        </FieldFormItem>
                      </Col>
                      <Col flex={1}>
                        <FieldFormItem
                          {...restField}
                          name={[name, 'value']}
                          fieldKey={[fieldKey, 'value']}
                          rules={[{ max: 30, message: '参数值长度不能超过 30' }]}
                        >
                          <Input placeholder="参数值" />
                        </FieldFormItem>
                      </Col>
                      <Col>
                        <FieldFormItem
                          {...restField}
                          name={[name, 'required']}
                          fieldKey={[fieldKey, 'required']}
                          valuePropName={'checked'}
                          rules={[{ required: true, message: '请选择是否必须' }]}
                        >
                          <Tooltip title={'是否必须'}>
                            <Checkbox />
                          </Tooltip>
                        </FieldFormItem>
                      </Col>
                      <Col flex={2}>
                        <FieldFormItem
                          {...restField}
                          name={[name, 'example']}
                          fieldKey={[fieldKey, 'example']}
                          rules={[
                            { max: 300, type: 'string', message: '参数示例长度不能超过 300' },
                          ]}
                        >
                          <Input placeholder="参数示例" />
                        </FieldFormItem>
                      </Col>
                      <Col flex={3}>
                        <FieldFormItem
                          {...restField}
                          name={[name, 'remark']}
                          fieldKey={[fieldKey, 'remark']}
                          rules={[{ max: 300, type: 'string', message: '备注长度不能超过 300' }]}
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
                        <Input value={apiDetail.api.id} />
                      </FieldFormItem>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </EditContainer>
        </div>
        <ApiTitle style={{ marginTop: 30 }}>返回数据设置</ApiTitle>
        <Radio.Group
          style={{ textAlign: 'center', width: '100%' }}
          options={['JSON', 'RAW']}
          value={respSetting}
          optionType={'button'}
          buttonStyle={'solid'}
          onChange={(event) => {
            setRespSetting(event.target.value);
            if (event.target.value !== 'JSON') {
              setRespJsonSchema(undefined);
            }
          }}
        />
        <EditContainer>
          {respSetting === 'JSON' && (
            <>
              <JsonSchemaEditor
                isMock={true}
                data={respJsonSchema}
                id={'response-body'}
                onChange={(e) => setRespJsonSchema(e)}
              />
            </>
          )}
          {respSetting === 'RAW' && (
            <FieldFormItem
              noStyle={true}
              name={'respRaw'}
              rules={[{ max: 30, message: 'RAW 示例不能超过 30' }]}
            >
              <Input.TextArea rows={3} />
            </FieldFormItem>
          )}
        </EditContainer>
        <ApiTitle style={{ marginTop: 30 }}>备 注</ApiTitle>
        <EditContainer>
          <FieldFormItem
            noStyle={true}
            name={'remark'}
            rules={[{ max: 300, message: '备注信息不能超过 300' }]}
          >
            <Input.TextArea rows={6} />
          </FieldFormItem>
        </EditContainer>
        <Affix offsetBottom={0} onChange={(af) => setAffixed(af)} style={{ marginTop: 30 }}>
          <SaveContainer style={{ backgroundColor: affixed ? 'rgb(230, 233, 236)' : undefined }}>
            <Button
              type="primary"
              loading={submitting}
              key={'submit'}
              htmlType={'submit'}
              onClick={handleSubmit}
            >
              保存
            </Button>
          </SaveContainer>
        </Affix>
      </Space>
    </Form>
  );
};
