import React, { useEffect, useState } from 'react';
import {
  ApiState,
  DocApi,
  DocProject,
  FormParamType,
  Header,
  HttpMethod,
  QueryParamType,
} from '@/service/doc/type';
import {
  Affix,
  AutoComplete,
  Button,
  Checkbox,
  Dropdown,
  Form,
  Grid,
  Input,
  InputNumber,
  Menu,
  Radio,
  Select,
  Space,
  Tooltip,
} from '@arco-design/web-react';
import { BlockTitle } from '@/components/doc/styled';
import styled from 'styled-components';
import ApiGroupSelect from '@/components/doc/ApiGroupSelect';
import { enumToSelectOptions } from '@/utils/render';
import _ from 'lodash';
import { IconDelete, IconDown, IconPlus } from '@arco-design/web-react/icon';
import {
  CONTENT_TYPE,
  REQUEST_HEADER,
} from '@/pages/doc/api-manager/api/api-detail/constent';
import MarkdownEditor from '@/components/Markdown/MarkdownEditor';
import { updateApi } from '@/service/doc/api';
import { saveApiInfo, updateApiInfo } from '@/service/doc/api-info';
import QuietJsonSchemaEditor from '@/components/QuietJsonSchemaEditor';

const { Row, Col } = Grid;
const { Item } = Form;

export type ApiEditorProps = {
  api: DocApi;
  projectInfo: DocProject;
  // TODO 更新结束要重新加载接口分组信息
};

const EditContainer = styled.div.attrs((props: { hide: boolean }) => props)`
  display: ${(props) => (props.hide ? 'none' : undefined)};

  .arco-input-disabled {
    color: rgb(var(--color-text-1));
    -webkit-text-fill-color: rgb(var(--color-text-1));
  }
`;

const SaveContainer = styled.div.attrs((props: { hide: boolean }) => props)`
  height: 56px;
  text-align: center;
  padding-top: 12px;
  background-color: ${(props) =>
    props.affixed ? 'rgb(var(--gray-3))' : undefined};
`;

function ApiEditor(props: ApiEditorProps) {
  const [form] = Form.useForm();
  const [reqParamSettingOptions, setReqParamSettingOptions] =
    useState<string[]>();
  const [reqParamSetting, setReqParamSetting] = useState<string>();
  const [respTypeSetting, setRespTypeSetting] = useState<string>();
  const [reqBodyTypeSetting, setReqBodyTypeSetting] = useState<string>();
  const [affixed, setAffixed] = useState<boolean>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [contentTypeDisplay, setContentTypeDisplay] = useState<
    'none' | undefined
  >('none');
  const [minLengthDisplay, setMinLengthDisplay] = useState<'none' | undefined>(
    'none'
  );
  const [maxLengthDisplay, setMaxLengthDisplay] = useState<'none' | undefined>(
    'none'
  );

  useEffect(() => {
    const options = getReqParamSettingOptionsByMethod(props.api.method);
    setReqParamSettingOptions(options);
    setReqParamSetting(options[0]);
    if (props.api.api_info?.req_form) {
      setReqBodyTypeSetting('form');
    }
    if (props.api.api_info?.req_json_body) {
      setReqBodyTypeSetting('json');
    }
    if (props.api.api_info?.req_file) {
      setReqBodyTypeSetting('file');
    }
    if (props.api.api_info?.req_raw) {
      setReqBodyTypeSetting('raw');
    }
    if (props.api.api_info?.resp_json_body) {
      setRespTypeSetting('JSON');
    }
    if (props.api.api_info?.resp_raw) {
      setRespTypeSetting('RAW');
    }
    form.setFieldsValue(props.api);
    // eslint-disable-next-line
  }, [JSON.stringify(props.api)]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const values = await form.validate();
      values.id = props.api.id;
      updateApi({ ...props.api, ...values }).then(() => {
        values.api_info.api_id = props.api.id;
        if (props.api.api_info) {
          values.api_info.id = props.api.api_info.id;
          updateApiInfo(values.api_info);
        } else {
          saveApiInfo(values.api_info);
        }
      });
    } catch (e) {
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  function getReqParamSettingOptionsByMethod(
    method: HttpMethod | string
  ): string[] {
    let datum = method;
    if (typeof method === 'string') {
      datum = HttpMethod[method];
    }
    const options = ['Query', 'Headers'];
    if (
      datum === HttpMethod.PUT ||
      datum === HttpMethod.DELETE ||
      datum === HttpMethod.POST ||
      datum === HttpMethod.PATCH
    ) {
      options.unshift('Body');
    }
    return options;
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
    path =
      path[path.length - 1] === '/' ? path.substr(0, path.length - 1) : path;
    return path;
  };

  function handleApiPathChange(value) {
    let val = value;
    const queue: { name: string; example: ''; remark: string }[] = [];
    const insertParams = (name: string) => {
      const findExist = _.find(form.getFieldValue('api_path_param'), { name });
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
          name = paths[i].substring(1);
          insertParams(name);
        }
      }
    }
    const insertParam = (str, match: string) => {
      insertParams(match);
    };
    if (val && val.length > 3) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      val.replace(/{(.+?)}/g, insertParam);
    }
    form.setFieldsValue({ ...form.getFieldsValue(), path_param: queue });
  }

  function handleReqBodyTypeChange(value: string) {
    setReqBodyTypeSetting(value);
    let headers: Header[] = form.getFieldValue('headers');
    let handleContentType: string | undefined = undefined;
    if (value === 'json') {
      handleContentType = 'application/json';
    }
    if (value === 'form') {
      handleContentType = 'multipart/form-data';
    }
    if (handleContentType) {
      if (headers) {
        headers = headers.filter(
          (header) =>
            header.name !== 'Content-Type' && header.value === handleContentType
        );
      }
      if (!headers) {
        headers = [];
      }
      const contentTypeHeader = headers.find(
        (header) => header.name === 'Content-Type'
      );
      headers = headers.filter((header) => header.name !== 'Content-Type');
      if (contentTypeHeader) {
        headers.push({
          ...contentTypeHeader,
          value: handleContentType,
          required: true,
        });
      } else {
        headers.push({
          name: 'Content-Type',
          value: handleContentType,
          required: true,
        });
      }
    }
    form.setFieldValue('api_info', {
      ...form.getFieldValue('api_info'),
      headers,
    });
  }

  return (
    <Form name={'api-edit-form'} labelCol={{ span: 4 }} form={form}>
      <Space direction={'vertical'}>
        <BlockTitle>基本设置</BlockTitle>
        <EditContainer>
          <Item
            label={'接口名称'}
            field={'name'}
            rules={[
              { required: true, message: '请输入接口名称' },
              { maxLength: 30, message: '接口名称长度不能超过 30' },
            ]}
          >
            <Input placeholder={'请输入接口名称'} />
          </Item>
          <Item label={'分组'} field={'api_group_id'}>
            <ApiGroupSelect
              projectId={props.projectInfo.id}
              allowClear={true}
              placeholder="请输入分组名称"
            />
          </Item>
          <Item label={'接口路径'}>
            <Input.Group compact>
              <Item field="method" noStyle>
                <Select
                  style={{ width: '15%' }}
                  options={enumToSelectOptions(HttpMethod)}
                  onChange={(method: HttpMethod) => {
                    const options: string[] =
                      getReqParamSettingOptionsByMethod(method);
                    setReqParamSettingOptions(options);
                    setReqParamSetting(options[0]);
                  }}
                />
              </Item>
              <Tooltip content="接口基本路径，可在 设置 里修改">
                <Input
                  style={{ width: '30%' }}
                  value={props.projectInfo.base_path}
                />
              </Tooltip>
              <Item
                noStyle
                field={'path'}
                rules={[
                  { required: true, message: '接口地址不能为空' },
                  { maxLength: 300, message: '接口地址长度不能超过 300' },
                ]}
              >
                <Input
                  style={{ width: '55%' }}
                  placeholder={'请输入接口地址'}
                  onChange={handleApiPathChange}
                />
              </Item>
            </Input.Group>
          </Item>
          <Item label={' '}>
            <Form.List field={'api_info.path_param'}>
              {(fields) => {
                return (
                  <>
                    {fields.map((item) => {
                      return (
                        <Row key={item.key} gutter={5}>
                          <Col span={4}>
                            <Item
                              noStyle
                              field={item.field + '.name'}
                              rules={[
                                { required: true, message: '请输入参数名称' },
                              ]}
                            >
                              <Input disabled={true} />
                            </Item>
                          </Col>
                          <Col span={10}>
                            <Item
                              noStyle
                              field={item.field + '.example'}
                              rules={[
                                {
                                  maxLength: 300,
                                  type: 'string',
                                  message: '参数示例长度不能超过 300',
                                },
                              ]}
                            >
                              <Input placeholder="参数示例" />
                            </Item>
                          </Col>
                          <Col span={10}>
                            <Item
                              noStyle
                              field={item.field + '.remark'}
                              rules={[
                                {
                                  maxLength: 300,
                                  type: 'string',
                                  message: '备注长度不能超过 300',
                                },
                              ]}
                            >
                              <Input
                                style={{ width: '100%' }}
                                placeholder="备注"
                              />
                            </Item>
                          </Col>
                        </Row>
                      );
                    })}
                  </>
                );
              }}
            </Form.List>
          </Item>
          <Item
            label={'状态'}
            field={'api_state'}
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: '请选择接口状态' }]}
          >
            <Select
              options={enumToSelectOptions(ApiState)}
              placeholder={'请选择接口状态'}
            />
          </Item>
        </EditContainer>
        <BlockTitle style={{ marginTop: 30 }}>请求参数设置</BlockTitle>
        <Radio.Group
          style={{ textAlign: 'center', width: '100%' }}
          options={reqParamSettingOptions}
          defaultValue={reqParamSetting}
          value={reqParamSetting}
          type={'button'}
          onChange={(value) => setReqParamSetting(value)}
        />
        <div>
          <EditContainer hide={reqParamSetting !== 'Body'}>
            <Radio.Group
              style={{ textAlign: 'left', paddingBottom: 12 }}
              options={['form', 'json', 'file', 'raw']}
              value={reqBodyTypeSetting}
              onChange={handleReqBodyTypeChange}
            />
            {reqBodyTypeSetting === 'form' && (
              <Form.List field="api_info.req_form">
                {(fields, { add, remove }) => (
                  <>
                    <Item>
                      <Dropdown.Button
                        type="primary"
                        size={'small'}
                        icon={<IconDown />}
                        onClick={() => add({ required: true, type: 'TEXT' })}
                        droplist={
                          <Menu>
                            <Menu.Item key="1">
                              <Checkbox
                                checked={contentTypeDisplay !== 'none'}
                                onClick={() =>
                                  setContentTypeDisplay(
                                    contentTypeDisplay ? undefined : 'none'
                                  )
                                }
                              >
                                ContentType
                              </Checkbox>
                            </Menu.Item>
                            <Menu.Item key="2">
                              <Checkbox
                                checked={minLengthDisplay !== 'none'}
                                onClick={() =>
                                  setMinLengthDisplay(
                                    minLengthDisplay ? undefined : 'none'
                                  )
                                }
                              >
                                MinLength
                              </Checkbox>
                            </Menu.Item>
                            <Menu.Item key="3">
                              <Checkbox
                                checked={maxLengthDisplay !== 'none'}
                                onClick={() =>
                                  setMaxLengthDisplay(
                                    maxLengthDisplay ? undefined : 'none'
                                  )
                                }
                              >
                                MaxLength
                              </Checkbox>
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        添加form参数
                      </Dropdown.Button>
                    </Item>
                    {fields.map((item, index) => (
                      <Row
                        align="center"
                        key={item.key}
                        gutter={10}
                        style={{
                          paddingBottom: 10,
                        }}
                      >
                        <Col flex={'260px'}>
                          <Item
                            noStyle
                            field={item.field + '.name'}
                            rules={[
                              { required: true, message: '请输入参数名称' },
                              {
                                maxLength: 30,
                                message: '参数长度不能超过 30',
                              },
                            ]}
                          >
                            <Input placeholder="参数名称" />
                          </Item>
                        </Col>
                        <Col flex={'24px'}>
                          <Item
                            noStyle
                            field={item.field + '.required'}
                            triggerPropName={'checked'}
                          >
                            <Checkbox style={{ paddingLeft: 0 }} />
                          </Item>
                        </Col>
                        <Col flex={'90px'}>
                          <Item
                            noStyle
                            field={item.field + '.type'}
                            rules={[
                              { required: true, message: '请选择参数类型' },
                            ]}
                          >
                            <Select
                              options={enumToSelectOptions(FormParamType)}
                            />
                          </Item>
                        </Col>
                        <Col
                          flex={'130px'}
                          style={{ display: contentTypeDisplay }}
                        >
                          <Item noStyle field={item.field + '.content_type'}>
                            <AutoComplete
                              placeholder={'Content-Type'}
                              data={CONTENT_TYPE}
                            />
                          </Item>
                        </Col>
                        <Col
                          flex={'100px'}
                          style={{ display: minLengthDisplay }}
                        >
                          <Item
                            noStyle
                            field={item.field + '.mix_length'}
                            rules={[
                              {
                                min: 0,
                                type: 'number',
                                message: '最小长度不能小于 0',
                              },
                            ]}
                          >
                            <InputNumber
                              min={0}
                              style={{ width: 100 }}
                              placeholder="最小长度"
                            />
                          </Item>
                        </Col>
                        <Col
                          flex={'100px'}
                          style={{ display: maxLengthDisplay }}
                        >
                          <Item
                            noStyle
                            field={item.field + '.max_length'}
                            rules={[{ min: 0, message: '最大长度不能小于 0' }]}
                          >
                            <InputNumber
                              min={0}
                              style={{ width: 100 }}
                              placeholder="最大长度"
                            />
                          </Item>
                        </Col>
                        <Col flex={'200px'}>
                          <Item
                            noStyle
                            field={item.field + '.example'}
                            rules={[
                              {
                                maxLength: 300,
                                message: '参数示例长度不能超过 300',
                              },
                            ]}
                          >
                            <Input placeholder="参数示例" />
                          </Item>
                        </Col>
                        <Col flex={'auto'}>
                          <Item
                            noStyle
                            field={item.field + '.remark'}
                            rules={[
                              {
                                maxLength: 300,
                                message: '备注长度不能超过 300',
                              },
                            ]}
                          >
                            <Input placeholder="备注" />
                          </Item>
                        </Col>
                        <Col
                          flex={'22px'}
                          style={{ color: 'red', cursor: 'pointer' }}
                        >
                          <IconDelete onClick={() => remove(index)} />
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>
            )}
            {reqBodyTypeSetting === 'json' && (
              <Item noStyle field={'api_info.req_json_body'}>
                <QuietJsonSchemaEditor />
              </Item>
            )}
            {reqBodyTypeSetting === 'file' && (
              <Item noStyle field={'api_info.req_file'}>
                <Input />
              </Item>
            )}
            {reqBodyTypeSetting === 'raw' && (
              <Item
                noStyle
                field={'api_info.req_raw'}
                rules={[{ max: 30, message: 'RAW 示例不能超过 30' }]}
              >
                <Input.TextArea rows={3} />
              </Item>
            )}
          </EditContainer>
          <EditContainer hide={reqParamSetting !== 'Query'}>
            <Form.List field="api_info.req_query">
              {(fields, { add, remove }) => (
                <>
                  <Item>
                    <Button
                      type="primary"
                      size={'small'}
                      onClick={() => add({ required: true, type: 'STRING' })}
                      icon={<IconPlus />}
                    >
                      添加Query参数
                    </Button>
                  </Item>
                  {fields.map((item, index) => (
                    <Row
                      align="center"
                      key={item.key}
                      gutter={10}
                      style={{
                        paddingBottom: 10,
                      }}
                    >
                      <Col flex={'auto'}>
                        <Item
                          noStyle
                          field={item.field + '.name'}
                          rules={[
                            { required: true, message: '请输入参数名称' },
                          ]}
                        >
                          <Input placeholder="参数名称" />
                        </Item>
                      </Col>
                      <Col flex={'24px'}>
                        <Item
                          noStyle
                          field={item.field + '.required'}
                          triggerPropName={'checked'}
                        >
                          <Checkbox style={{ paddingLeft: 0 }} />
                        </Item>
                      </Col>
                      <Col flex={'92px'}>
                        <Item
                          noStyle
                          field={item.field + '.type'}
                          rules={[
                            { required: true, message: '请选择参数类型' },
                          ]}
                        >
                          <Select
                            style={{ width: '92px' }}
                            options={enumToSelectOptions(QueryParamType)}
                          />
                        </Item>
                      </Col>
                      <Col flex={'135px'}>
                        <Item noStyle field={item.field + '.mix'}>
                          <InputNumber min={0} placeholder="最小长度（值）" />
                        </Item>
                      </Col>
                      <Col flex={'135px'}>
                        <Item noStyle field={item.field + '.max'}>
                          <InputNumber min={0} placeholder="最大长度（值）" />
                        </Item>
                      </Col>
                      <Col flex={'auto'}>
                        <Item
                          noStyle
                          field={item.field + '.example'}
                          rules={[
                            {
                              maxLength: 300,
                              message: '参数示例长度不能超过 300',
                            },
                          ]}
                        >
                          <Input placeholder="参数示例" />
                        </Item>
                      </Col>
                      <Col flex={'auto'}>
                        <Item
                          noStyle
                          field={item.field + '.remark'}
                          rules={[
                            {
                              maxLength: 300,
                              type: 'string',
                              message: '备注长度不能超过 300',
                            },
                          ]}
                        >
                          <Input style={{ width: '100%' }} placeholder="备注" />
                        </Item>
                      </Col>
                      <Col
                        flex={'22px'}
                        style={{ color: 'red', cursor: 'pointer' }}
                      >
                        <IconDelete onClick={() => remove(index)} />
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </EditContainer>
          <EditContainer hide={reqParamSetting !== 'Headers'}>
            <Form.List field="api_info.headers">
              {(fields, { add, remove }) => (
                <>
                  <Item>
                    <Button
                      type="primary"
                      size={'small'}
                      onClick={() => add({ required: true })}
                      icon={<IconPlus />}
                    >
                      添加Header
                    </Button>
                  </Item>
                  {fields.map((item, index) => (
                    <Row
                      align="center"
                      key={item.key}
                      gutter={10}
                      style={{
                        paddingBottom: 10,
                      }}
                    >
                      <Col flex={'220px'}>
                        <Item
                          noStyle
                          field={item.field + 'name'}
                          rules={[
                            { required: true, message: '请输入参数名称' },
                          ]}
                        >
                          <AutoComplete
                            placeholder={'参数名称'}
                            data={REQUEST_HEADER}
                          />
                        </Item>
                      </Col>
                      <Col flex={'auto'}>
                        <Item
                          noStyle
                          field={item.field + 'value'}
                          rules={[
                            { maxLength: 30, message: '参数值长度不能超过 30' },
                          ]}
                        >
                          <Input placeholder="参数值" />
                        </Item>
                      </Col>
                      <Col flex={'24px'}>
                        <Item
                          noStyle
                          field={item.field + '.required'}
                          triggerPropName={'checked'}
                        >
                          <Checkbox style={{ paddingLeft: 0 }} />
                        </Item>
                      </Col>
                      <Col flex={3}>
                        <Item
                          noStyle
                          field={item.field + '.remark'}
                          rules={[
                            {
                              maxLength: 300,
                              message: '备注长度不能超过 300',
                            },
                          ]}
                        >
                          <Input style={{ width: '100%' }} placeholder="备注" />
                        </Item>
                      </Col>
                      <Col flex={'22px'}>
                        <IconDelete
                          style={{ color: 'red', cursor: 'pointer' }}
                          onClick={() => remove(index)}
                        />
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>
          </EditContainer>
        </div>
        <BlockTitle style={{ marginTop: 30 }}>返回数据设置</BlockTitle>
        <Radio.Group
          type={'button'}
          value={respTypeSetting}
          options={['JSON', 'RAW']}
          style={{ textAlign: 'center', width: '100%' }}
          onChange={(value) => setRespTypeSetting(value)}
        />
        <EditContainer>
          {respTypeSetting === 'JSON' && (
            <Item noStyle field={'api_info.resp_json_body'}>
              <QuietJsonSchemaEditor />
            </Item>
          )}
          {respTypeSetting === 'RAW' && (
            <Item
              noStyle
              field={'api_info.resp_raw'}
              rules={[{ maxLength: 30, message: 'RAW 示例不能超过 30' }]}
            >
              <Input.TextArea rows={3} />
            </Item>
          )}
        </EditContainer>
        <BlockTitle style={{ marginTop: 30 }}>备 注</BlockTitle>
        <Item
          noStyle
          field={'remark'}
          rules={[{ max: 300, message: '备注信息不能超过 300' }]}
        >
          <MarkdownEditor maxLength={300} value={props.api.remark} />
        </Item>
        <Affix
          offsetBottom={0}
          onChange={(af) => setAffixed(af)}
          style={{ marginTop: 30 }}
        >
          <SaveContainer affixed={affixed} style={{}}>
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
}

export default ApiEditor;