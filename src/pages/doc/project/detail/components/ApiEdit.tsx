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
} from 'antd';
import type { ApiDetail } from '@/services/doc/EntityType';
import styled from 'styled-components';
import { DebounceSelect } from '@/pages/components/DebounceSelect';
import { listApiGroupByProjectIdAndName } from '@/services/doc/DocApiGroup';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { ApiState, FormParamType, HttpMethod, QueryParamType } from '@/services/doc/Enums';
import _ from 'lodash';
import { updateApi } from '@/services/doc/DocApi';
import { saveApiInfo, updateApiInfo } from '@/services/doc/DocApiInfo';
import JsonSchemaEditor from '@quiet-front-end/json-schema-editor-visual';
import type { Header } from '@/services/doc/EntityType';

interface ApiEditProps {
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

  const [apiEditForm] = Form.useForm();

  const [reqParamSettingOptions, setReqParamSettingOptions] = useState<string[]>();
  const [reqParamSetting, setReqParamSetting] = useState<string>();
  const [reqJsonBody, setReqJsonBody] = useState<any>(apiDetail.api_info?.req_json_body);
  const [respTypeSetting, setRespTypeSetting] = useState<string>('JSON');
  const [respJsonBody, setRespJsonBody] = useState<any>(apiDetail.api_info?.resp_json_body);
  const [reqBodyTypeSetting, setReqBodyTypeSetting] = useState<string>('form');
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
    apiEditForm.setFieldsValue({
      name: apiDetail.api.name,
      api_state: ApiState[apiDetail.api.api_state],
      method: HttpMethod[apiDetail.api.method],
      path: apiDetail.api.path,
      remark: apiDetail.api.remark,
      api_group_id: apiDetail.api.api_group
        ? {
            value: apiDetail.api.api_group.id,
            label: apiDetail.api.api_group.name,
          }
        : undefined,
      ...apiDetail.api_info,
    });
    const options = getReqParamSettingOptionsByMethod(apiDetail.api.method);
    setReqParamSettingOptions(options);
    setReqParamSetting(options[0]);
  }, [
    apiDetail.api.api_group,
    apiDetail.api.api_state,
    apiDetail.api.method,
    apiDetail.api.name,
    apiDetail.api.path,
    apiDetail.api.remark,
    apiDetail.api_info,
    apiEditForm,
  ]);

  useEffect(() => {
    if (apiDetail.api_info?.req_form) {
      setReqBodyTypeSetting('form');
    }
    if (apiDetail.api_info?.req_json_body) {
      setReqBodyTypeSetting('json');
    }
    if (apiDetail.api_info?.req_file) {
      setReqBodyTypeSetting('file');
    }
    if (apiDetail.api_info?.req_raw) {
      setReqBodyTypeSetting('raw');
    }
    if (apiDetail.api_info?.resp_json_body) {
      setRespTypeSetting('JSON');
    }
    if (apiDetail.api_info?.resp_raw) {
      setRespTypeSetting('RAW');
    }
  }, []);

  function listApiGroupByName(name: string) {
    return listApiGroupByProjectIdAndName(projectId, name);
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

  function handleApiPathChange(event: ChangeEvent<HTMLInputElement>) {
    let val = event.target.value;
    const queue: { name: string; example: ''; remark: string }[] = [];
    const insertParams = (name: string) => {
      const findExist = _.find(apiEditForm.getFieldValue('api_path_param'), { name });
      if (findExist) {
        queue.push(findExist);
      } else {
        queue.push({ name, example: '', remark: '' });
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
    apiEditForm.setFieldsValue({ ...apiEditForm.getFieldsValue(), path_param: queue });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const values = await apiEditForm.validateFields();
      values.id = apiDetail.api.id;
      values.api_group_id = values.api_group_id?.value;
      if (respTypeSetting === 'JSON') {
        values.resp_json_body = respJsonBody;
        values.resp_raw = null;
      } else {
        values.resp_json_body = null;
      }
      if (reqBodyTypeSetting === 'json') {
        values.req_json_body = reqJsonBody;
        values.req_form = null;
        values.req_file = null;
        values.req_raw = null;
      } else {
        values.req_json_body = null;
      }
      await updateApi({ ...apiDetail.api, ...values });
      delete values.id;
      if (apiDetail.api_info) {
        await updateApiInfo({ ...apiDetail.api_info, ...values });
      } else {
        await saveApiInfo({ ...values, api_id: apiDetail.api.id });
      }
    } catch (e) {
      setSubmitting(false);
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  function handleReqBodyTypeChange(value: string) {
    setReqBodyTypeSetting(value);
    let headers: Header[] = apiEditForm.getFieldValue('headers');
    if (value !== 'json') {
      setReqJsonBody(undefined);
      headers = headers.filter(
        (header) => header.name !== 'Content-Type' && header.value === 'application/json',
      );
    } else {
      setReqJsonBody(apiDetail.api_info?.req_json_body);
      if (!headers) {
        headers = [];
      }
      const contentType = headers.find((header) => header.name === 'Content-Type');
      headers = headers.filter((header) => header.name !== 'Content-Type');
      if (contentType) {
        headers.push({ ...contentType, value: 'application/json', required: true });
      } else {
        headers.push({ name: 'Content-Type', value: 'application/json', required: true });
      }
    }
    apiEditForm.setFieldsValue({ ...apiEditForm.getFieldsValue(), headers });
  }

  function handleRespTypeChange(value: string) {
    setRespTypeSetting(value);
    if (value !== 'JSON') {
      setRespJsonBody(undefined);
    } else {
      setRespJsonBody(apiDetail.api_info?.resp_json_body);
    }
  }

  return (
    <Form name={'apiEditForm'} labelCol={{ span: 4 }} form={apiEditForm}>
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
          <FieldFormItem label={'分组'} name={'api_group_id'}>
            <DebounceSelect
              allowClear={true}
              placeholder="请输入分组名称"
              fetchOptions={listApiGroupByName}
            />
          </FieldFormItem>
          <FieldFormItem
            label={'接口路径'}
            name={'path'}
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
              onChange={handleApiPathChange}
            />
          </FieldFormItem>
          <Form.List name="path_param">
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
                        <Input disabled={true} />
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
                  </Row>
                ))}
              </>
            )}
          </Form.List>
          <FieldFormItem
            label={'状态'}
            name={'api_state'}
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
              defaultValue={reqBodyTypeSetting}
              value={reqBodyTypeSetting}
              onChange={(e) => handleReqBodyTypeChange(e.target.value)}
            />
            {reqBodyTypeSetting === 'form' && (
              <Form.List name="req_form">
                {(fields, { add, remove }) => (
                  <>
                    <FieldFormItem>
                      <Button
                        type="primary"
                        size={'small'}
                        onClick={() => add({ required: true, type: FormParamType.TEXT })}
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
                          >
                            <Checkbox />
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
                              <Select.Option value={FormParamType.TEXT}>text</Select.Option>
                              <Select.Option value={FormParamType.FILE}>file</Select.Option>
                            </Select>
                          </FieldFormItem>
                        </Col>
                        <Col flex={'100px'}>
                          <FieldFormItem
                            {...restField}
                            name={[name, 'mix_length']}
                            fieldKey={[fieldKey, 'mix_length']}
                            rules={[{ min: 0, type: 'number', message: '最小长度不能小于 0' }]}
                          >
                            <InputNumber min={0} style={{ width: 100 }} placeholder="最小长度" />
                          </FieldFormItem>
                        </Col>
                        <Col flex={'100px'}>
                          <FieldFormItem
                            {...restField}
                            name={[name, 'max_length']}
                            fieldKey={[fieldKey, 'max_length']}
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
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>
            )}
            {reqBodyTypeSetting === 'json' && (
              <JsonSchemaEditor
                isMock={true}
                data={JSON.parse(JSON.stringify(apiDetail.api_info?.req_json_body))}
                onChange={(e) => {
                  setReqJsonBody(e);
                }}
              />
            )}
            {reqBodyTypeSetting === 'file' && (
              <FieldFormItem noStyle={true} name={'req_file'}>
                <Input />
              </FieldFormItem>
            )}
            {reqBodyTypeSetting === 'raw' && (
              <FieldFormItem
                noStyle={true}
                name={'req_raw'}
                rules={[{ max: 30, message: 'RAW 示例不能超过 30' }]}
              >
                <Input.TextArea rows={3} />
              </FieldFormItem>
            )}
          </EditContainer>
          <EditContainer hide={reqParamSetting !== 'Query'}>
            <Form.List name="req_query">
              {(fields, { add, remove }) => (
                <>
                  <FieldFormItem>
                    <Button
                      type="primary"
                      size={'small'}
                      onClick={() => add({ required: true, type: QueryParamType.STRING })}
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
                        >
                          <Checkbox />
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
                            <Select.Option value={QueryParamType.STRING}>string</Select.Option>
                            <Select.Option value={QueryParamType.NUMBER}>number</Select.Option>
                            <Select.Option value={QueryParamType.INTEGER}>int</Select.Option>
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
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </EditContainer>
          <EditContainer hide={reqParamSetting !== 'Headers'}>
            <Form.List name="headers">
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
                        >
                          <Checkbox />
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
          value={respTypeSetting}
          optionType={'button'}
          buttonStyle={'solid'}
          onChange={(e) => handleRespTypeChange(e.target.value)}
        />
        <EditContainer>
          {respTypeSetting === 'JSON' && (
            <>
              <JsonSchemaEditor
                isMock={true}
                data={JSON.parse(JSON.stringify(apiDetail.api_info?.resp_json_body))}
                onChange={(e) => {
                  setRespJsonBody(e);
                }}
              />
            </>
          )}
          {respTypeSetting === 'RAW' && (
            <FieldFormItem
              noStyle={true}
              name={'resp_raw'}
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
