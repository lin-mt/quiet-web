import React, { useEffect, useRef, useState } from 'react';
import {
  DocApi,
  DocProject,
  DocProjectEnv,
  FormParam,
  FormParamType,
  Header,
  HttpProtocol,
} from '@/service/doc/type';
import {
  Anchor,
  Button,
  Checkbox,
  Descriptions,
  Empty,
  Form,
  Grid,
  Input,
  Select,
  Space,
  Upload,
} from '@arco-design/web-react';
import { BlockTitle, SecondTitle } from '@/components/doc/styled';
import styles from './style/index.module.less';
import jsf from 'json-schema-faker';
import { IconEraser, IconUpload } from '@arco-design/web-react/icon';
import { UploadItem } from '@arco-design/web-react/es/Upload';
import { QuietEditor } from '@/components/QuietEditor';
import { listEnv } from '@/service/doc/project-env';
import req from '@/utils/request';
import { getMethodTagColor } from '@/utils/doc/render';

const AnchorLink = Anchor.Link;
const { Row, Col } = Grid;
const { useForm } = Form;

export type ApiRunProps = {
  apiDetail: DocApi;
  projectInfo: DocProject;
};

function ApiRun(props: ApiRunProps) {
  const { apiDetail, projectInfo } = props;
  const apiInfo = apiDetail.api_info;
  const [form] = useForm();
  const [envs, setEnvs] = useState<DocProjectEnv[]>([]);
  const [reqFormFiles, setReqFormFiles] = useState<
    Record<string, UploadItem[]>
  >({});
  const [reqFileList, setReqFileList] = useState<UploadItem[]>([]);
  const [respOriginHeaders, setRespOriginHeaders] = useState();
  const [respBodyLanguage, setRespBodyLanguage] = useState<string>('text');
  const [respBodyValue, setRespBodyValue] = useState<string>();

  const reqBodyEditor = useRef(null);

  useEffect(() => {
    form.setFieldsValue(apiInfo);
    if (apiInfo?.req_json_body) {
      form.setFieldValue(
        'req_json_body',
        JSON.stringify(jsf.generate(apiInfo.req_json_body), null, 2)
      );
    }
    listEnv(projectInfo.id).then((resp) => {
      if (resp?.length > 0) {
        // 默认第一个
        const env = resp[0];
        form.setFieldValue('env_id', env.id);
        pushEnvHeaders(env.headers);
      }
      setEnvs(resp);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(apiInfo), projectInfo.id]);

  function pushEnvHeaders(envHeaders?: Header[]) {
    const headers: Header[] = apiInfo?.headers ? apiInfo?.headers : [];
    envHeaders?.forEach((header) => {
      headers.push(header);
    });
    form.setFieldValue('headers', headers);
  }

  function buildReqPath() {
    return (
      apiInfo?.path_param &&
      apiInfo?.path_param.length > 0 && (
        <>
          <Row>
            <SecondTitle style={{ width: '100%' }} id={'req-path'}>
              Path Parameters
            </SecondTitle>
          </Row>
          <Form.List field={'path_param'}>
            {(fields) => (
              <>
                {fields.map((item) => (
                  <Row align="center" key={item.key} style={{ paddingTop: 10 }}>
                    <Col flex={'30%'}>
                      <Form.Item noStyle field={item.field + 'name'}>
                        <Input disabled={true} />
                      </Form.Item>
                    </Col>
                    <Col flex={'20px'} style={{ textAlign: 'center' }}>
                      =
                    </Col>
                    <Col flex={'auto'}>
                      <Form.Item
                        noStyle={{ showErrorTip: true }}
                        field={item.field + 'example'}
                        rules={[
                          {
                            required: true,
                            message: `请输入${
                              form.getFieldValue('path_param')[item.key].name
                            }的值`,
                          },
                        ]}
                      >
                        <Input placeholder={'请输入'} />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
        </>
      )
    );
  }

  function buildReqQuery() {
    return (
      apiInfo?.req_query &&
      apiInfo?.req_query.length > 0 && (
        <>
          <Row>
            <SecondTitle id={'req-query'}>Query Parameters</SecondTitle>
          </Row>
          <Form.List field={'req_query'}>
            {(fields) => (
              <>
                {fields.map((item) => {
                  const filedValue = form.getFieldValue('req_query')[item.key];
                  return (
                    <Row
                      align={'center'}
                      key={item.key}
                      style={{ paddingTop: 10 }}
                    >
                      <Col flex={'30%'}>
                        <Form.Item noStyle field={item.field + 'name'}>
                          <Input disabled />
                        </Form.Item>
                      </Col>
                      <Col flex={'20px'} style={{ textAlign: 'center' }}>
                        =
                      </Col>
                      <Col flex={'24px'} style={{ textAlign: 'center' }}>
                        <Form.Item
                          noStyle
                          field={item.field + 'required'}
                          triggerPropName={'checked'}
                        >
                          <Checkbox disabled style={{ paddingLeft: 0 }} />
                        </Form.Item>
                      </Col>
                      <Col flex={'auto'}>
                        <Form.Item
                          noStyle
                          field={item.field + 'example'}
                          rules={[
                            {
                              required: filedValue.required,
                              message: `请输入${filedValue.name}的值`,
                            },
                          ]}
                        >
                          <Input placeholder={'请输入'} />
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                })}
              </>
            )}
          </Form.List>
        </>
      )
    );
  }

  function buildReqHeader() {
    // TODO 处理 cookies
    return (
      <Form.Item
        noStyle
        shouldUpdate={(prev, next) => prev.env_id !== next.env_id}
      >
        {(values) => {
          return values.env_id || apiInfo?.headers ? (
            <>
              <Row>
                <SecondTitle id={'req-header'}>Headers</SecondTitle>
              </Row>
              <Form.List field={'headers'}>
                {(fields) => (
                  <>
                    {fields.map((item) => {
                      const filedValue =
                        form.getFieldValue('headers')[item.key];
                      return (
                        <Row
                          key={item.key}
                          align={'center'}
                          style={{ paddingTop: 10 }}
                        >
                          <Col flex={'30%'}>
                            <Form.Item noStyle field={item.field + '.name'}>
                              <Input disabled={true} />
                            </Form.Item>
                          </Col>
                          <Col flex={'20px'} style={{ textAlign: 'center' }}>
                            =
                          </Col>
                          <Col flex={'24px'} style={{ textAlign: 'center' }}>
                            <Form.Item
                              noStyle
                              field={item.field + '.required'}
                              triggerPropName={'checked'}
                            >
                              <Checkbox disabled style={{ paddingLeft: 0 }} />
                            </Form.Item>
                          </Col>
                          <Col flex={'auto'}>
                            <Form.Item
                              noStyle
                              field={item.field + '.value'}
                              rules={[
                                {
                                  required: filedValue.required,
                                  message: `请输入${filedValue.name}的值`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={'请输入'}
                                disabled={filedValue.disabled}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      );
                    })}
                  </>
                )}
              </Form.List>
            </>
          ) : null;
        }}
      </Form.Item>
    );
  }

  function buildReqBody() {
    return (
      (apiInfo?.req_form ||
        apiInfo?.req_raw ||
        apiInfo?.req_file ||
        apiInfo?.req_json_body) && (
        <>
          <Row>
            <SecondTitle id={'req-body'}>Body</SecondTitle>
          </Row>
          {apiInfo?.req_form && (
            <Form.List field={'req_form'}>
              {(fields) => (
                <>
                  {fields.map((item) => {
                    const filedValue = form.getFieldValue('req_form')[item.key];
                    const type = FormParamType[filedValue.type];
                    return (
                      <div key={item.key}>
                        <Row align={'center'} style={{ paddingTop: 10 }}>
                          <Col flex={'30%'}>
                            <Form.Item noStyle field={item.field + '.name'}>
                              <Input disabled />
                            </Form.Item>
                          </Col>
                          {type === FormParamType.TEXT && (
                            <Col flex={'20px'} style={{ textAlign: 'center' }}>
                              =
                            </Col>
                          )}
                          <Col flex={'24px'} style={{ textAlign: 'center' }}>
                            <Form.Item
                              noStyle
                              field={item.field + '.required'}
                              triggerPropName={'checked'}
                            >
                              <Checkbox disabled style={{ paddingLeft: 0 }} />
                            </Form.Item>
                          </Col>
                          <Col flex={'auto'}>
                            {type === FormParamType.TEXT && (
                              <Form.Item
                                noStyle={{ showErrorTip: true }}
                                field={item.field + '.example'}
                                rules={[
                                  {
                                    required: filedValue.required,
                                    message: `请输入${filedValue.name}的值`,
                                  },
                                ]}
                              >
                                <Input placeholder={'请输入'} />
                              </Form.Item>
                            )}
                          </Col>
                        </Row>
                        {type === FormParamType.FILE && (
                          <Row align={'center'} style={{ paddingTop: 10 }}>
                            <Upload
                              fileList={reqFormFiles[filedValue.name]}
                              beforeUpload={(file) => {
                                let datumList: UploadItem[];
                                const newFile: UploadItem = {
                                  name: file.name,
                                  uid: file.name,
                                  originFile: file,
                                };
                                if (reqFormFiles[filedValue.name]) {
                                  let duplicate = false;
                                  reqFormFiles[filedValue.name].forEach(
                                    (datum) => {
                                      if (datum.name === file.name) {
                                        duplicate = true;
                                      }
                                    }
                                  );
                                  if (!duplicate) {
                                    datumList = [
                                      ...reqFormFiles[filedValue.name],
                                      newFile,
                                    ];
                                  } else {
                                    return false;
                                  }
                                } else {
                                  datumList = [newFile];
                                }
                                setReqFormFiles({
                                  ...reqFormFiles,
                                  [filedValue.name]: datumList,
                                });
                                return false;
                              }}
                              onRemove={(file) => {
                                const files = reqFormFiles[filedValue.name];
                                const newFileList = files.filter(
                                  (datum) => datum.name !== file.name
                                );
                                setReqFormFiles({
                                  ...reqFormFiles,
                                  [filedValue.name]: newFileList,
                                });
                              }}
                            >
                              <Button size={'small'} icon={<IconUpload />}>
                                选择文件
                              </Button>
                            </Upload>
                          </Row>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </Form.List>
          )}
          {apiInfo.req_file && (
            <Row gutter={5} style={{ paddingTop: 10 }}>
              <Col flex={'30%'}>
                <Form.Item noStyle field={'req_file'}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col flex={'20px'} style={{ textAlign: 'center' }}>
                =
              </Col>
              <Col flex={'auto'}>
                <Upload
                  fileList={reqFileList}
                  beforeUpload={(file) => {
                    const newFileList = reqFileList.filter(
                      (datum) => datum.name !== file.name
                    );
                    newFileList.push({
                      name: file.name,
                      uid: file.name,
                      originFile: file,
                    });
                    return false;
                  }}
                  onRemove={(file) => {
                    setReqFileList(
                      reqFileList.filter((datum) => datum.name !== file.name)
                    );
                  }}
                >
                  <Button size={'small'} icon={<IconUpload />}>
                    选择文件
                  </Button>
                </Upload>
              </Col>
            </Row>
          )}
          {(apiInfo?.req_raw || apiInfo?.req_json_body) && (
            <div>
              {apiInfo?.req_json_body && (
                <Button
                  type={'primary'}
                  size={'small'}
                  style={{ marginTop: 10 }}
                  icon={<IconEraser />}
                  onClick={() => {
                    if (reqBodyEditor.current !== null) {
                      reqBodyEditor.current
                        .getAction('editor.action.formatDocument')
                        .run();
                    }
                  }}
                >
                  格式化
                </Button>
              )}
              <div style={{ marginTop: 10 }}>
                <Form.Item
                  noStyle
                  field={apiInfo?.req_raw ? 'req_raw' : 'req_json_body'}
                >
                  <QuietEditor
                    language={apiInfo?.req_json_body ? 'json' : undefined}
                    onMount={(editor) => {
                      reqBodyEditor.current = editor;
                    }}
                    height={300}
                  />
                </Form.Item>
              </div>
            </div>
          )}
        </>
      )
    );
  }

  function removePathSeparator(path: string): string {
    if (!path) {
      return path;
    }
    let removed: string;
    removed = path.startsWith('/') ? path.substring(1) : path;
    removed = removed.endsWith('/')
      ? removed.substring(0, removed.length - 1)
      : removed;
    return removed;
  }

  function downloadFileFromResp(resp) {
    const filename = resp.headers['content-disposition'].replace(
      /\w+;filename=(.*)/,
      '$1'
    );
    const blob = new Blob([resp.data], { type: resp.headers['content-type'] });
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
      // navigator.msSaveBlob(blob, filename);
    }
  }

  function handleSendRequest(values) {
    let path;
    if (envs.length > 0) {
      path = `${values.env_id}`;
    } else {
      path = '0';
    }
    if (projectInfo.base_path) {
      path = `${path}/${removePathSeparator(projectInfo.base_path)}`;
    }
    path = `${path}/${removePathSeparator(apiDetail.path)}`;
    // 添加 Header
    let headers: Record<string, string>;
    if (values.headers) {
      headers = {};
      for (let i = 0; i < values.headers.length; i++) {
        headers[values.headers[i].name] = values.headers[i].value;
      }
    }
    // 处理路径参数
    if (values.path_param) {
      for (let i = 0; i < values.path_param.length; i++) {
        path = path.replace(
          `{${values.path_param[i].name}}`,
          values.path_param[i].example
        );
      }
    }
    // 处理查询参数
    let params: Record<string, string>;
    if (values.req_query) {
      params = {};
      for (let i = 0; i < values.req_query.length; i++) {
        params[values.req_query[i].name] = values.req_query[i].example;
      }
    }
    // 处理Body
    let data;
    if (apiInfo?.req_form) {
      data = new FormData();
      for (let i = 0; i < values.req_form.length; i++) {
        const formData: FormParam = values.req_form[i];
        if (formData.type === FormParamType.TEXT.toString()) {
          data.append(
            formData.name,
            new Blob([formData.example], { type: formData.content_type })
          );
        } else {
          const formDataFile = reqFormFiles[formData.name];
          if (formDataFile && formDataFile.length > 0) {
            for (let j = 0; j < formDataFile.length; j++) {
              data.append(formData.name, formDataFile[j]);
            }
          }
        }
      }
    }
    if (apiInfo?.req_raw) {
      data = values.req_raw;
    }
    if (apiInfo?.req_file) {
      data = new FormData();
      if (reqFileList && reqFileList.length > 0) {
        reqFileList.forEach((file) => {
          data.append(values.req_file, file);
        });
      }
    }
    if (apiInfo?.req_json_body) {
      data = JSON.parse(values.req_json_body);
    }
    req(`/doc/request/${path}`, {
      method: apiDetail.method,
      headers,
      params,
      data,
    }).then((resp) => {
      const originHeaders = resp.headers['origin-headers'];
      if (originHeaders) {
        setRespOriginHeaders(JSON.parse(originHeaders));
      }
      const content = resp.headers['content-disposition'];
      if (content) {
        // 下载文件
        downloadFileFromResp(resp);
      }
      if (resp.data) {
        const contentType = resp.headers['content-type'];
        if (contentType === 'application/json') {
          setRespBodyLanguage('json');
          setRespBodyValue(JSON.stringify(resp.data, null, 4));
        } else {
          setRespBodyLanguage('text');
          setRespBodyValue(resp.data);
        }
      }
    });
  }

  return (
    <Row className={[styles['api-run']]}>
      <Col span={21} style={{ paddingRight: 20 }}>
        <Form id={'api-run-form'} form={form} onSubmit={handleSendRequest}>
          <Space
            size={'large'}
            direction={'vertical'}
            style={{ width: '100%' }}
          >
            <Space
              direction={'vertical'}
              size={'medium'}
              style={{ width: '100%' }}
            >
              <BlockTitle id={'req'}>请求数据</BlockTitle>
              <Input.Group compact={true}>
                <Input
                  disabled
                  value={apiDetail.method}
                  style={{
                    width: '8%',
                    textAlign: 'center',
                    color: getMethodTagColor(apiDetail.method),
                  }}
                />
                {envs.length > 0 ? (
                  <Form.Item noStyle field={'env_id'}>
                    <Select
                      style={{ width: '30%' }}
                      placeholder={'请选择环境'}
                      onChange={(value) => {
                        form.setFieldValue('env_id', value);
                        envs.forEach((env) => {
                          if (env.id === value) {
                            pushEnvHeaders(env.headers);
                          }
                        });
                      }}
                      options={envs.map((env) => ({
                        value: env.id,
                        label: `${env.name}：http${
                          env.protocol === HttpProtocol.HTTP ? '' : 's'
                        }://${env.domain}`,
                      }))}
                    />
                  </Form.Item>
                ) : (
                  <Input
                    disabled
                    value={'http://127.0.0.1:9363'}
                    style={{ width: '30%' }}
                  />
                )}
                <Input
                  disabled
                  value={`${
                    projectInfo.base_path ? projectInfo.base_path : ''
                  }${apiDetail.path}`}
                  style={{ width: '50%' }}
                />
                <Button
                  type={'primary'}
                  htmlType={'submit'}
                  style={{ width: '11%', float: 'right' }}
                >
                  发送
                </Button>
              </Input.Group>
              {buildReqPath()}
              {buildReqQuery()}
              {buildReqHeader()}
              {buildReqBody()}
            </Space>
            <Space
              direction={'vertical'}
              size={'medium'}
              style={{ width: '100%' }}
            >
              <BlockTitle id={'res'}>响应数据</BlockTitle>
              <Row>
                <SecondTitle id={'res-body'}>Body</SecondTitle>
              </Row>
              {respBodyValue ? (
                <QuietEditor
                  language={respBodyLanguage}
                  value={respBodyValue}
                  height={300}
                />
              ) : (
                <Empty />
              )}
              <Row>
                <SecondTitle id={'res-header'}>Headers</SecondTitle>
              </Row>
              {respOriginHeaders ? (
                <Descriptions
                  border
                  column={1}
                  size={'small'}
                  data={Object.keys(respOriginHeaders).map((key) => ({
                    label: key,
                    value: respOriginHeaders[key],
                  }))}
                />
              ) : (
                <Empty />
              )}
            </Space>
          </Space>
        </Form>
      </Col>
      <Col span={3}>
        <Anchor
          hash={false}
          offsetTop={80}
          boundary={70}
          style={{ backgroundColor: 'var(--color-bg-2)', width: 160 }}
        >
          <AnchorLink href="#req" title="请求数据">
            <AnchorLink href="#req-path" title="Path Parameters" />
            <AnchorLink href="#req-query" title="Query Parameters" />
            <AnchorLink href="#req-header" title="Headers" />
            <AnchorLink href="#req-body" title="Body" />
          </AnchorLink>
          <AnchorLink href="#res" title="响应数据">
            <AnchorLink href="#res-body" title="Body" />
            <AnchorLink href="#res-header" title="Headers" />
          </AnchorLink>
        </Anchor>
      </Col>
    </Row>
  );
}

export default ApiRun;
