// noinspection HttpUrlsUsage

import { Affix, Anchor, Button, Checkbox, Col, Form, Input, Row, Select, Upload } from 'antd';
import type {
  ApiDetail,
  DocProject,
  DocProjectEnvironment,
  FormParam,
} from '@/services/doc/EntityType';
import { useEffect, useRef, useState } from 'react';
import { listByProjectId } from '@/services/doc/DocProjectEnvironment';
import { FormParamType, HttpProtocol } from '@/services/doc/Enums';
import styled from 'styled-components';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { QuietEditor } from '@/pages/components/QuietEditor';
import _ from 'lodash';
import { request } from 'umi';
import jsf from 'json-schema-faker';

const PartTitle = styled.h2`
  font-size: 17px;
  margin-top: 10px;
  font-weight: 600;
  color: rgb(39, 56, 72);
`;

const PartBodyTitle = styled.h3`
  font-size: 15px;
  margin-top: 5px;
  font-weight: 399;
  color: rgba(39, 56, 72, 0.92);
`;

const DisabledInput = styled(Input)`
  color: rgba(0, 0, 0, 0.69);
`;

interface ApiRunProps {
  apiDetail: ApiDetail;
  projectInfo: DocProject;
}

export default function ApiRun(props: ApiRunProps) {
  const { apiDetail, projectInfo } = props;
  const [environments, setEnvironments] = useState<DocProjectEnvironment[]>([]);
  const [selectEnvIndex, setSelectEnvIndex] = useState<number>(0);
  const [formDataFiles, setFormDataFiles] = useState<Record<string, RcFile[]>>({});
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [respHeaders, setRespHeaders] = useState<Headers | undefined>();
  const [respOriginHeaders, setRespOriginHeaders] = useState<any>();
  const [respBody, setRespBody] = useState();
  const [respBodyLanguage, setRespBodyLanguage] = useState<string>('text');
  const [form] = Form.useForm();
  const reqBodyEditor = useRef<any>(null);
  const respHeaderEditor = useRef<any>(null);
  const respBodyEditor = useRef<any>(null);

  useEffect(() => {
    if (respHeaderEditor.current !== null) {
      let headerValues = '';
      if (respOriginHeaders) {
        Object.keys(respOriginHeaders).forEach((headerKey) => {
          headerValues += `${headerKey}: ${respOriginHeaders[headerKey]}\r\n`;
        });
      } else if (respHeaders) {
        respHeaders.forEach(function (value, name) {
          headerValues += `${name}: ${value}\r\n`;
        });
      }
      respHeaderEditor.current.setValue(headerValues);
    }
  }, [respHeaders, respOriginHeaders]);

  useEffect(() => {
    if (respBodyEditor.current !== null) {
      if (respBody) {
        const contentType = respHeaders?.get('content-type');
        let respBodyStr: string | undefined;
        if (contentType === 'application/json') {
          setRespBodyLanguage('json');
          respBodyStr = JSON.stringify(respBody);
        } else {
          setRespBodyLanguage('text');
          respBodyStr = respBody;
        }
        respBodyEditor.current.setValue(respBodyStr);
        respBodyEditor.current.getAction('editor.action.formatDocument').run();
      } else {
        respBodyEditor.current.setValue('');
      }
    }
  }, [respBody, respHeaders]);

  useEffect(() => {
    if (projectInfo.id) {
      form.resetFields();
      listByProjectId(projectInfo.id).then((resp) => setEnvironments(resp));
    }
  }, [form, projectInfo.id]);

  useEffect(() => {
    const fieldsValue: any = _.clone(form.getFieldsValue());
    if (environments.length > 0) {
      const envHeaders = environments[selectEnvIndex].headers;
      if (envHeaders) {
        if (!fieldsValue.headers) {
          fieldsValue.headers = [];
        }
        fieldsValue.headers.unshift(...envHeaders);
      }
    }
    form.setFieldsValue(fieldsValue);
  }, [environments, form, selectEnvIndex]);

  useEffect(() => {
    const fieldsValue: any = _.clone(apiDetail.api_info);
    if (apiDetail.api_info?.req_json_body) {
      fieldsValue.req_json_body = JSON.stringify(jsf.generate(apiDetail.api_info.req_json_body));
    }
    form.setFieldsValue(fieldsValue);
    setRespHeaders(undefined);
    setRespOriginHeaders(undefined);
    setRespBody(undefined);
  }, [apiDetail.api_info, form]);

  function removePathSeparator(path: string): string {
    if (!path) {
      return path;
    }
    let removed: string;
    removed = path.startsWith('/') ? path.substr(1, path.length) : path;
    removed = removed.endsWith('/') ? removed.substr(0, removed.length - 1) : removed;
    return removed;
  }

  function downloadFileFromResp(content: string, res: any) {
    const disposition = content.split(';');
    let filename: string = '未知文件';
    disposition.forEach((datum) => {
      if (datum.startsWith('filename=')) {
        filename = datum.replace('filename=', '');
      }
    });
    res.response.blob().then((resBlob: BlobPart) => {
      const blob = new Blob([resBlob]);
      if ('download' in document.createElement('a')) {
        // 非IE下载
        const downloadElement = document.createElement('a');
        downloadElement.download = filename;
        downloadElement.style.display = 'none';
        downloadElement.href = URL.createObjectURL(blob);
        document.body.appendChild(downloadElement);
        downloadElement.click();
        URL.revokeObjectURL(downloadElement.href); // 释放URL 对象
        document.body.removeChild(downloadElement);
      } else {
        // IE10+下载
        // @ts-ignore
        navigator.msSaveBlob(blob, filename);
      }
    });
  }

  function handleFormOnFinish(values: any) {
    let path;
    if (environments.length > 0) {
      const basePath = removePathSeparator(environments[selectEnvIndex].base_path);
      path = `${environments[selectEnvIndex].id}/${basePath}`;
    } else {
      path = '0';
    }
    if (projectInfo.base_path) {
      path = `${path}/${removePathSeparator(projectInfo.base_path)}`;
    }
    path = `${path}/${removePathSeparator(apiDetail.api.path)}`;
    // 添加 Header
    let headers: Record<string, string> | undefined = undefined;
    if (values.headers) {
      headers = {};
      for (let i = 0; i < values.headers.length; i++) {
        headers[values.headers[i].name] = values.headers[i].value;
      }
    }
    // 处理路径参数
    if (values.path_param) {
      for (let i = 0; i < values.path_param.length; i++) {
        path = path.replace(`{${values.path_param[i].name}}`, values.path_param[i].example);
      }
    }
    // 处理查询参数
    let params: Record<string, string> | undefined = undefined;
    if (values.req_query) {
      params = {};
      for (let i = 0; i < values.req_query.length; i++) {
        params[values.req_query[i].name] = values.req_query[i].example;
      }
    }
    // 处理Body
    let data: any;
    if (apiDetail.api_info?.req_form) {
      data = new FormData();
      for (let i = 0; i < values.req_form.length; i++) {
        const formData: FormParam = values.req_form[i];
        if (formData.type === FormParamType.TEXT.toString()) {
          data.append(formData.name, new Blob([formData.example], { type: formData.content_type }));
        } else {
          const formDataFile = formDataFiles[formData.name];
          if (formDataFile && formDataFile.length > 0) {
            for (let j = 0; j < formDataFile.length; j++) {
              data.append(formData.name, formDataFile[j]);
            }
          }
        }
      }
    }
    if (apiDetail.api_info?.req_raw) {
      data = values.req_raw;
    }
    if (apiDetail.api_info?.req_file) {
      data = new FormData();
      if (fileList && fileList.length > 0) {
        fileList.forEach((file) => {
          data.append(values.req_file, file);
        });
      }
    }
    if (apiDetail.api_info?.req_json_body) {
      data = JSON.parse(values.req_json_body);
    }
    let reqPath = `/api/doc/request/${path}`;
    if (params) {
      reqPath = reqPath + '?';
      for (const paramsKey in params) {
        reqPath = reqPath + paramsKey + '=' + params[paramsKey];
      }
    }
    request(`/api/doc/request/${path}`, {
      method: apiDetail.api.method,
      headers,
      params,
      data,
      getResponse: true,
    }).then((resp) => {
      const originHeaders = resp.response.headers?.get('origin-headers');
      if (originHeaders) {
        setRespOriginHeaders(JSON.parse(originHeaders));
      }
      setRespHeaders(resp.response.headers);
      const content = resp.response.headers?.get('content-disposition');
      if (content) {
        // 下载文件
        downloadFileFromResp(content, resp);
      }
      setRespBody(resp.data);
    });
  }

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30, paddingBottom: 20 }}>
      <Row gutter={20} wrap={false}>
        <Col span={19}>
          <Form name={'apiRunForm'} form={form} onFinish={handleFormOnFinish}>
            <PartTitle id={'request'} style={{ marginTop: 0 }}>
              Request
            </PartTitle>
            <Input.Group>
              <Input
                value={apiDetail.api.method}
                disabled={true}
                style={{ color: 'rgba(0, 0, 0, 0.69)', width: '8%', textAlign: 'center' }}
              />
              {environments.length > 0 ? (
                <Form.Item name={'environment_id'} noStyle={true}>
                  <Select
                    value={selectEnvIndex}
                    style={{ width: '20%' }}
                    onChange={(envIndex) => setSelectEnvIndex(envIndex)}
                  >
                    {environments.map((environment, index) => {
                      if (environment.id) {
                        return (
                          <Select.Option key={environment.id} value={index}>{`${
                            environment.name
                          }：${
                            environment.protocol === HttpProtocol.HTTP ? 'http://' : 'https://'
                          }${environment.base_path}`}</Select.Option>
                        );
                      }
                      return;
                    })}
                  </Select>
                </Form.Item>
              ) : (
                <Input
                  value={'http://127.0.0.1:9363'}
                  disabled={true}
                  style={{ color: 'rgba(0, 0, 0, 0.69)', width: '20%' }}
                />
              )}
              <Input
                value={`${projectInfo.base_path ? projectInfo.base_path : ''}${apiDetail.api.path}`}
                disabled={true}
                style={{ color: 'rgba(0, 0, 0, 0.69)', width: '60%' }}
              />
              <Button type={'primary'} htmlType={'submit'} style={{ width: '11%', float: 'right' }}>
                发送
              </Button>
            </Input.Group>
            <div style={{ marginTop: 10 }}>
              {((apiDetail.api_info?.headers && apiDetail.api_info?.headers.length > 0) ||
                environments[selectEnvIndex]?.headers) && (
                <div>
                  <PartBodyTitle id={'req_header'} style={{ marginTop: 0 }}>
                    Header
                  </PartBodyTitle>
                  <Form.List name={'headers'}>
                    {(fields) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }, index) => {
                          const filedValue = form.getFieldValue('headers')[key];
                          return (
                            <Row
                              key={key}
                              gutter={5}
                              style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                marginTop: index === 0 ? 0 : 5,
                              }}
                            >
                              <Col flex={'30%'}>
                                <Form.Item {...restField} name={[name, 'name']}>
                                  <DisabledInput disabled={true} />
                                </Form.Item>
                              </Col>
                              <Col>=</Col>
                              <Col>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'required']}
                                  valuePropName={'checked'}
                                >
                                  <Checkbox disabled={true} />
                                </Form.Item>
                              </Col>
                              <Col flex={'auto'}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'value']}
                                  rules={[
                                    {
                                      required: filedValue.required,
                                      message: `请输入${filedValue.name}的值`,
                                    },
                                  ]}
                                >
                                  <Input disabled={filedValue.disabled} />
                                </Form.Item>
                              </Col>
                            </Row>
                          );
                        })}
                      </>
                    )}
                  </Form.List>
                </div>
              )}
              {apiDetail.api_info?.path_param && apiDetail.api_info?.path_param.length > 0 && (
                <div>
                  <PartBodyTitle id={'req_path_param'}>PathParameter</PartBodyTitle>
                  <Form.List name={'path_param'}>
                    {(fields) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                          <Row
                            key={key}
                            gutter={5}
                            style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              marginTop: index === 0 ? 0 : 5,
                            }}
                          >
                            <Col flex={'30%'}>
                              <Form.Item {...restField} name={[name, 'name']}>
                                <DisabledInput disabled={true} />
                              </Form.Item>
                            </Col>
                            <Col>=</Col>
                            <Col flex={'auto'}>
                              <Form.Item
                                {...restField}
                                name={[name, 'example']}
                                rules={[
                                  {
                                    required: true,
                                    message: `请输入${
                                      form.getFieldValue('path_param')[key].name
                                    }的值`,
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                        ))}
                      </>
                    )}
                  </Form.List>
                </div>
              )}
              {apiDetail.api_info?.req_query && apiDetail.api_info?.req_query.length > 0 && (
                <div>
                  <PartBodyTitle id={'req_query'}>Query</PartBodyTitle>
                  <Form.List name={'req_query'}>
                    {(fields) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }, index) => {
                          const filedValue = form.getFieldValue('req_query')[key];
                          return (
                            <Row
                              key={key}
                              gutter={5}
                              style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                marginTop: index === 0 ? 0 : 5,
                              }}
                            >
                              <Col flex={'30%'}>
                                <Form.Item {...restField} name={[name, 'name']}>
                                  <DisabledInput disabled={true} />
                                </Form.Item>
                              </Col>
                              <Col>=</Col>
                              <Col>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'required']}
                                  valuePropName={'checked'}
                                >
                                  <Checkbox disabled={true} />
                                </Form.Item>
                              </Col>
                              <Col flex={'auto'}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'example']}
                                  rules={[
                                    {
                                      required: filedValue.required,
                                      message: `请输入${filedValue.name}的值`,
                                    },
                                  ]}
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                            </Row>
                          );
                        })}
                      </>
                    )}
                  </Form.List>
                </div>
              )}
              {(apiDetail.api_info?.req_form ||
                apiDetail.api_info?.req_raw ||
                apiDetail.api_info?.req_file ||
                apiDetail.api_info?.req_json_body) && (
                <div>
                  <PartBodyTitle id={'req_body'}>Body</PartBodyTitle>
                  {apiDetail.api_info?.req_form && (
                    <Form.List name={'req_form'}>
                      {(fields) => (
                        <>
                          {fields.map(({ key, name, fieldKey, ...restField }, index) => {
                            const filedValue = form.getFieldValue('req_form')[key];
                            return (
                              <Row
                                key={key}
                                gutter={5}
                                wrap={false}
                                style={{
                                  display: 'flex',
                                  alignItems: 'baseline',
                                  marginTop: index === 0 ? 0 : 5,
                                }}
                              >
                                <Col flex={'30%'}>
                                  <Form.Item {...restField} name={[name, 'name']}>
                                    <DisabledInput disabled={true} />
                                  </Form.Item>
                                </Col>
                                <Col>=</Col>
                                <Col>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'required']}
                                    valuePropName={'checked'}
                                  >
                                    <Checkbox disabled={true} />
                                  </Form.Item>
                                </Col>
                                <Col flex={'auto'}>
                                  {filedValue.type === FormParamType.TEXT && (
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'example']}
                                      rules={[
                                        {
                                          required: filedValue.required,
                                          message: `请输入${filedValue.name}的值`,
                                        },
                                      ]}
                                    >
                                      <Input />
                                    </Form.Item>
                                  )}
                                  {
                                    // fixme 文件名称过长会导致样式💥
                                  }
                                  {filedValue.type === FormParamType.FILE && (
                                    <Upload
                                      fileList={formDataFiles[filedValue.name]}
                                      beforeUpload={(file: RcFile) => {
                                        let datumList: RcFile[];
                                        if (formDataFiles[filedValue.name]) {
                                          let duplicate = false;
                                          formDataFiles[filedValue.name].forEach((datum) => {
                                            if (datum.name === file.name) {
                                              duplicate = true;
                                            }
                                          });
                                          if (!duplicate) {
                                            datumList = [...formDataFiles[filedValue.name], file];
                                          } else {
                                            return false;
                                          }
                                        } else {
                                          datumList = [file];
                                        }
                                        setFormDataFiles({
                                          ...formDataFiles,
                                          [filedValue.name]: datumList,
                                        });
                                        return false;
                                      }}
                                      onRemove={(file: UploadFile) => {
                                        const files = formDataFiles[filedValue.name];
                                        const newFileList = files.filter(
                                          (datum) => datum.name !== file.name,
                                        );
                                        setFormDataFiles({
                                          ...formDataFiles,
                                          [filedValue.name]: newFileList,
                                        });
                                      }}
                                    >
                                      <Button size={'small'} icon={<UploadOutlined />}>
                                        选择文件
                                      </Button>
                                    </Upload>
                                  )}
                                </Col>
                              </Row>
                            );
                          })}
                        </>
                      )}
                    </Form.List>
                  )}
                  {apiDetail.api_info.req_file && (
                    <Row
                      gutter={5}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                      }}
                    >
                      <Col flex={'30%'}>
                        <Form.Item name={'req_file'} noStyle={true}>
                          <DisabledInput value={apiDetail.api_info.req_file} disabled={true} />
                        </Form.Item>
                      </Col>
                      <Col>=</Col>
                      <Col flex={'auto'}>
                        <Upload
                          fileList={fileList}
                          beforeUpload={(file: RcFile) => {
                            const newFileList = fileList.filter(
                              (datum) => datum.name !== file.name,
                            );
                            newFileList.push(file);
                            return false;
                          }}
                          onRemove={(file) => {
                            setFileList(fileList.filter((datum) => datum.name !== file.name));
                          }}
                        >
                          <Button size={'small'} icon={<UploadOutlined />}>
                            选择文件
                          </Button>
                        </Upload>
                      </Col>
                    </Row>
                  )}
                  {(apiDetail.api_info?.req_raw || apiDetail.api_info?.req_json_body) && (
                    <div>
                      {apiDetail.api_info?.req_json_body && (
                        <Button
                          type={'primary'}
                          onClick={() => {
                            if (reqBodyEditor.current !== null) {
                              reqBodyEditor.current.getAction('editor.action.formatDocument').run();
                            }
                          }}
                        >
                          格式化
                        </Button>
                      )}
                      <Form.Item
                        style={{ marginTop: 10 }}
                        name={apiDetail.api_info?.req_raw ? 'req_raw' : 'req_json_body'}
                      >
                        <QuietEditor
                          language={apiDetail.api_info?.req_json_body ? 'json' : undefined}
                          lineNumbers={'off'}
                          onMount={(editor) => {
                            reqBodyEditor.current = editor;
                            setTimeout(() => {
                              // todo 优化下？
                              editor.getAction('editor.action.formatDocument').run();
                            }, 1000);
                          }}
                          height={369}
                        />
                      </Form.Item>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Form>

          <PartTitle id={'response'}>Response</PartTitle>
          <PartBodyTitle id={'resp_header'}>Header</PartBodyTitle>
          <QuietEditor
            lineNumbers={'off'}
            onMount={(editor) => (respHeaderEditor.current = editor)}
            height={369}
          />
          <PartBodyTitle id={'resp_body'}>Body</PartBodyTitle>
          <QuietEditor
            lineNumbers={'off'}
            language={respBodyLanguage}
            onMount={(editor) => (respBodyEditor.current = editor)}
            height={369}
          />
        </Col>
        <Col span={5}>
          <Affix offsetTop={90}>
            <Anchor targetOffset={200}>
              <Anchor.Link href="#request" title="Request">
                {((apiDetail.api_info?.headers && apiDetail.api_info?.headers.length > 0) ||
                  environments[selectEnvIndex]?.headers) && (
                  <Anchor.Link href="#req_header" title="Header" />
                )}
                {apiDetail.api_info?.path_param && apiDetail.api_info?.path_param.length > 0 && (
                  <Anchor.Link href="#req_path_param" title="PathParameter" />
                )}
                {apiDetail.api_info?.req_query && apiDetail.api_info?.req_query.length > 0 && (
                  <Anchor.Link href="#req_query" title="Query" />
                )}
                {(apiDetail.api_info?.req_form ||
                  apiDetail.api_info?.req_raw ||
                  apiDetail.api_info?.req_file ||
                  apiDetail.api_info?.req_json_body) && (
                  <Anchor.Link href="#req_body" title="Body" />
                )}
              </Anchor.Link>
              <Anchor.Link href={'#response'} title={'Response'}>
                <Anchor.Link href={'#resp_header'} title={'Header'} />
                <Anchor.Link href={'#resp_body'} title={'Body'} />
              </Anchor.Link>
            </Anchor>
          </Affix>
        </Col>
      </Row>
    </div>
  );
}
