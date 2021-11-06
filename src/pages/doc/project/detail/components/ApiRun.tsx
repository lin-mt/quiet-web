// noinspection HttpUrlsUsage

import { Affix, Anchor, Button, Checkbox, Col, Input, Row, Select, Upload } from 'antd';
import type { ApiDetail, DocProject, DocProjectEnvironment } from '@/services/doc/EntityType';
import { useEffect, useRef, useState } from 'react';
import { listByProjectId } from '@/services/doc/DocProjectEnvironment';
import { FormParamType, HttpProtocol } from '@/services/doc/Enums';
import styled from 'styled-components';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { QuietEditor } from '@/pages/components/QuietEditor';

const PartTitle = styled.h2`
  font-size: 17px;
  margin-top: 10px;
  font-weight: 600;
  color: rgba(39, 56, 72, 0.95);
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
  const [selectEnvIndex, setSelectEnvIndex] = useState<number | undefined>();
  const [formDataFiles, setFormDataFiles] = useState<Record<string, RcFile[]>>({});
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (projectInfo.id) {
      listByProjectId(projectInfo.id).then((resp) => setEnvironments(resp));
    }
  }, [projectInfo.id]);

  useEffect(() => {
    if (environments.length > 0) {
      setSelectEnvIndex(0);
    }
  }, [environments]);

  return (
    <div style={{ paddingLeft: 30, paddingRight: 30, paddingBottom: 20 }}>
      <Row gutter={20} wrap={false}>
        <Col span={19}>
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
              <Select
                value={selectEnvIndex}
                style={{ width: '20%' }}
                onChange={(envIndex) => setSelectEnvIndex(envIndex)}
              >
                {environments.map((environment, index) => {
                  if (environment.id) {
                    return (
                      <Select.Option key={environment.id} value={index}>{`${environment.name}：${
                        environment.protocol === HttpProtocol.HTTP ? 'http://' : 'https://'
                      }${environment.base_path}`}</Select.Option>
                    );
                  }
                  return;
                })}
              </Select>
            ) : (
              <Input
                value={'http://127.0.0.1'}
                disabled={true}
                style={{ color: 'rgba(0, 0, 0, 0.69)', width: '20%' }}
              />
            )}
            <Input
              value={projectInfo.base_path + apiDetail.api.path}
              disabled={true}
              style={{ color: 'rgba(0, 0, 0, 0.69)', width: '60%' }}
            />
            <Button type={'primary'} style={{ width: '11%', float: 'right' }}>
              发送
            </Button>
          </Input.Group>
          <div style={{ marginTop: 10 }}>
            {(apiDetail.api_info?.headers ||
              (selectEnvIndex && environments[selectEnvIndex].headers)) && (
              <div>
                <PartBodyTitle id={'req_header'} style={{ marginTop: 0 }}>
                  Header
                </PartBodyTitle>
                {apiDetail.api_info?.headers.map((header, index) => {
                  return (
                    <Row
                      key={header.name}
                      gutter={5}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        marginTop: index === 0 ? 0 : 5,
                      }}
                    >
                      <Col flex={'30%'}>
                        <DisabledInput value={header.name} disabled={true} />
                      </Col>
                      <Col>=</Col>
                      <Col>
                        <Checkbox checked={header.required} disabled={true} />
                      </Col>
                      <Col flex={'auto'}>
                        <Input value={header.value} />
                      </Col>
                    </Row>
                  );
                })}
                {selectEnvIndex &&
                  environments[selectEnvIndex].headers?.map((header, index) => {
                    return (
                      <Row
                        key={header.name}
                        gutter={5}
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          marginTop: index === 0 ? 0 : 5,
                        }}
                      >
                        <Col flex={'30%'}>
                          <DisabledInput value={header.name} disabled={true} />
                        </Col>
                        <Col>=</Col>
                        <Col>
                          <Checkbox checked={header.required} disabled={true} />
                        </Col>
                        <Col flex={'auto'}>
                          <DisabledInput value={header.value} />
                        </Col>
                      </Row>
                    );
                  })}
              </div>
            )}
            {apiDetail.api_info?.path_param && (
              <div>
                <PartBodyTitle id={'req_path_param'}>PathParameter</PartBodyTitle>
                {apiDetail.api_info.path_param.map((param, index) => {
                  return (
                    <Row
                      key={param.name}
                      gutter={5}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        marginTop: index === 0 ? 0 : 5,
                      }}
                    >
                      <Col flex={'30%'}>
                        <DisabledInput value={param.name} disabled={true} />
                      </Col>
                      <Col>=</Col>
                      <Col flex={'auto'}>
                        <Input value={param.example} />
                      </Col>
                    </Row>
                  );
                })}
              </div>
            )}
            {apiDetail.api_info?.req_query && (
              <div>
                <PartBodyTitle id={'req_query'}>Query</PartBodyTitle>
                {apiDetail.api_info.req_query.map((query, index) => {
                  return (
                    <Row
                      key={query.name}
                      gutter={5}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        marginTop: index === 0 ? 0 : 5,
                      }}
                    >
                      <Col flex={'30%'}>
                        <DisabledInput value={query.name} disabled={true} />
                      </Col>
                      <Col>=</Col>
                      <Col>
                        <Checkbox checked={query.required} disabled={true} />
                      </Col>
                      <Col flex={'auto'}>
                        <Input value={query.example} />
                      </Col>
                    </Row>
                  );
                })}
              </div>
            )}
            {(apiDetail.api_info?.req_form ||
              apiDetail.api_info?.req_raw ||
              apiDetail.api_info?.req_file ||
              apiDetail.api_info?.req_json_body) && (
              <div>
                <PartBodyTitle id={'req_body'}>Body</PartBodyTitle>
                {apiDetail.api_info.req_form.map((param, index) => {
                  return (
                    <Row
                      key={param.name}
                      gutter={5}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        marginTop: index === 0 ? 0 : 8,
                      }}
                    >
                      <Col flex={'30%'}>
                        <DisabledInput value={param.name} disabled={true} />
                      </Col>
                      <Col>=</Col>
                      <Col>
                        <Checkbox checked={param.required} disabled={true} />
                      </Col>
                      {
                        // fixme 文件名称长度过长会破坏排版
                      }
                      <Col flex={'auto'}>
                        {param.type === FormParamType.TEXT && <Input value={param.example} />}
                        {param.type === FormParamType.FILE && (
                          <Upload
                            fileList={formDataFiles[param.name]}
                            beforeUpload={(file: RcFile) => {
                              let datumList: RcFile[];
                              if (formDataFiles[param.name]) {
                                let duplicate = false;
                                formDataFiles[param.name].forEach((datum) => {
                                  if (datum.name === file.name) {
                                    duplicate = true;
                                  }
                                });
                                if (!duplicate) {
                                  datumList = [...formDataFiles[param.name], file];
                                } else {
                                  return false;
                                }
                              } else {
                                datumList = [file];
                              }
                              setFormDataFiles({ ...formDataFiles, [param.name]: datumList });
                              return false;
                            }}
                            onRemove={(file: UploadFile) => {
                              const files = formDataFiles[param.name];
                              const newFileList = files.filter((datum) => datum.name !== file.name);
                              setFormDataFiles({ ...formDataFiles, [param.name]: newFileList });
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

                {apiDetail.api_info.req_file && (
                  <Row
                    gutter={5}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                    }}
                  >
                    <Col flex={'30%'}>
                      <DisabledInput value={apiDetail.api_info.req_file} disabled={true} />
                    </Col>
                    <Col>=</Col>
                    <Col flex={'auto'}>
                      <Upload
                        fileList={fileList}
                        beforeUpload={(file: RcFile) => {
                          const newFileList = fileList.filter((datum) => datum.name !== file.name);
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
                    <Button
                      type={'primary'}
                      onClick={() => {
                        if (editorRef.current !== null) {
                          editorRef.current.getAction('editor.action.formatDocument').run();
                        }
                      }}
                    >
                      格式化
                    </Button>
                    <div
                      style={{
                        borderWidth: 1,
                        borderColor: '#d9d9d9',
                        borderStyle: 'solid',
                        marginTop: 10,
                      }}
                    >
                      <QuietEditor
                        defaultValue={
                          apiDetail.api_info?.req_raw
                            ? apiDetail.api_info?.req_raw
                            : JSON.stringify(apiDetail.api_info?.req_json_body)
                        }
                        language={apiDetail.api_info?.req_json_body ? 'json' : undefined}
                        lineNumbers={'off'}
                        onMount={(editor) => (editorRef.current = editor)}
                        height={369}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <PartTitle id={'response'}>Response</PartTitle>
          <PartBodyTitle id={'resp_header'}>Header</PartBodyTitle>
          <PartBodyTitle id={'resp_body'}>Body</PartBodyTitle>
        </Col>
        <Col span={5}>
          <Affix offsetTop={90}>
            <Anchor targetOffset={200}>
              <Anchor.Link href="#request" title="Request">
                {(apiDetail.api_info?.headers ||
                  (selectEnvIndex && environments[selectEnvIndex].headers)) && (
                  <Anchor.Link href="#req_header" title="Header" />
                )}
                {apiDetail.api_info?.path_param && (
                  <Anchor.Link href="#req_path_param" title="PathParameter" />
                )}
                {apiDetail.api_info?.req_query && <Anchor.Link href="#req_query" title="Query" />}
                {(apiDetail.api_info?.req_form ||
                  apiDetail.api_info?.req_raw ||
                  apiDetail.api_info?.req_file ||
                  apiDetail.api_info?.req_json_body) && (
                  <Anchor.Link href="#req_body" title="Body" />
                )}
              </Anchor.Link>
              <Anchor.Link href={'#response'} title={'Response'}>
                <Anchor.Link href={'#req_header'} title={'Header'} />
                <Anchor.Link href={'#resp_body'} title={'Body'} />
              </Anchor.Link>
            </Anchor>
          </Affix>
        </Col>
      </Row>
    </div>
  );
}
