import {
  AutoComplete,
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Tabs,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import type { DocProjectEnvironment } from '@/services/doc/EntityType';
import {
  deleteProjectEnvironment,
  listByProjectId,
  saveProjectEnvironment,
  updateProjectEnvironment,
} from '@/services/doc/DocProjectEnvironment';
import { HttpProtocol } from '@/services/doc/Enums';
import _ from 'lodash';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { REQUEST_HEADER } from '@/constant/doc/Values';

const DeleteOutlinedHoverRed = styled(DeleteOutlined)`
  :hover {
    color: red;
  }
`;

interface EnvironmentProp {
  projectId: string;
}

export default function (props: EnvironmentProp) {
  const [form] = Form.useForm();
  const [environments, setEnvironments] = useState<DocProjectEnvironment[]>([]);
  const [activeKey, setActiveKey] = useState<string | undefined>();
  const newKey = 'new_key';
  const newEnv: DocProjectEnvironment = {
    id: newKey,
    name: '新环境',
    protocol: HttpProtocol.HTTP,
    base_path: '127.0.0.1',
    project_id: props.projectId,
    headers: [],
    cookies: [],
  };

  useEffect(() => {
    listByProjectId(props.projectId).then((resp) => setEnvironments(resp));
  }, [props.projectId]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (environments.length > 0 && !activeKey) {
        setActiveKey(environments[0].id);
      }
      environments.forEach((environment) => {
        if (environment.id === activeKey) {
          form.setFieldsValue(environment);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [activeKey, environments, form]);

  function addEnvironment() {
    for (const environment of environments) {
      if (environment.id === newKey) {
        message.warn(`${environment.name} 的环境配置还未保存，请先保存！`).then();
        return;
      }
    }
    setEnvironments(environments.concat(newEnv));
    setActiveKey(newKey);
  }

  function deleteEnvironment(id: string | undefined) {
    if (!id) {
      return;
    }
    if (id === activeKey) {
      setActiveKey(undefined);
    }
    if (id === newKey) {
      const environmentsClone = _.clone(environments);
      environmentsClone.pop();
      setEnvironments(environmentsClone);
    } else {
      deleteProjectEnvironment(id).then(() => {
        if (id === activeKey) {
          if (environments.length > 0) {
            setActiveKey(environments[0].id);
          }
        }
      });
    }
  }

  function handleTabEdit(
    e: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) {
    switch (action) {
      case 'add':
        addEnvironment();
        break;
      case 'remove':
        break;
    }
  }

  function handleFormFinish(environment: DocProjectEnvironment) {
    if (environment.id === newKey) {
      delete environment.id;
      saveProjectEnvironment(environment).then((resp) => {
        const newEnvironments: DocProjectEnvironment[] = [];
        environments.forEach((datum) => {
          if (datum.id === newKey) {
            setActiveKey(resp.id);
            newEnvironments.push(resp);
          } else {
            newEnvironments.push(datum);
          }
        });
        setEnvironments(newEnvironments);
      });
    } else {
      updateProjectEnvironment(environment).then((resp) => {
        const newEnvironments: DocProjectEnvironment[] = [];
        environments.forEach((datum) => {
          if (datum.id === environment.id) {
            newEnvironments.push(resp);
          } else {
            newEnvironments.push(datum);
          }
        });
        setEnvironments(newEnvironments);
      });
    }
  }

  return (
    <div>
      <Tabs
        tabPosition={'left'}
        type={'editable-card'}
        onEdit={handleTabEdit}
        activeKey={activeKey}
        tabBarStyle={{ width: 200 }}
        onTabClick={(key) => {
          environments.forEach((environment) => {
            if (environment.id === key) {
              setActiveKey(key);
            }
          });
        }}
        addIcon={
          <span>
            <PlusOutlined />
            新增环境
          </span>
        }
      >
        {environments.map((environment) => {
          return (
            <Tabs.TabPane
              tab={
                <Typography.Text
                  ellipsis={{ tooltip: true }}
                  style={{ width: 136, color: activeKey === environment.id ? '#1890ff' : 'black' }}
                >
                  {environment.name}
                </Typography.Text>
              }
              key={environment.id}
              closeIcon={
                <Popconfirm
                  title={`确认删除环境配置：${environment.name} 吗？`}
                  onConfirm={() => deleteEnvironment(environment.id)}
                >
                  <DeleteOutlinedHoverRed />
                </Popconfirm>
              }
            >
              <Form
                form={form}
                layout={'vertical'}
                autoComplete="off"
                initialValues={environment}
                style={{ width: 700 }}
                onFinish={handleFormFinish}
              >
                <Form.Item hidden={true} name={'id'}>
                  <Input />
                </Form.Item>
                <Form.Item hidden={true} name={'project_id'}>
                  <Input />
                </Form.Item>
                <Form.Item
                  name={'name'}
                  label={'环境名称'}
                  rules={[{ required: true }, { type: 'string', max: 30 }]}
                >
                  <Input
                    placeholder={'请输入环境名称'}
                    onChange={(event) => {
                      const newEnvironments: DocProjectEnvironment[] = [];
                      environments.forEach((datum) => {
                        if (datum.id === environment.id) {
                          const newDatum = _.clone(datum);
                          newDatum.name = event.target.value;
                          newEnvironments.push(newDatum);
                        } else {
                          newEnvironments.push(datum);
                        }
                      });
                      setEnvironments(newEnvironments);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name={'base_path'}
                  label={'环境域名'}
                  rules={[{ required: true }, { type: 'string', max: 90 }]}
                >
                  <Input
                    placeholder={'请输入环境域名'}
                    addonBefore={
                      <Form.Item name={'protocol'} noStyle={true}>
                        <Select style={{ width: 88 }}>
                          <Select.Option value={HttpProtocol.HTTP}>http://</Select.Option>
                          <Select.Option value={HttpProtocol.HTTPS}>https://</Select.Option>
                        </Select>
                      </Form.Item>
                    }
                  />
                </Form.Item>
                <Form.Item label={'Header'}>
                  <Form.List name={'headers'}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <Form.Item style={{ marginBottom: 16 }} key={name}>
                            <Space align={'center'} size={101}>
                              <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                fieldKey={[fieldKey, 'name']}
                                noStyle={true}
                              >
                                <AutoComplete
                                  placeholder={'请输入header名称'}
                                  style={{ width: 178 }}
                                  options={REQUEST_HEADER}
                                />
                              </Form.Item>
                              <Space>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'value']}
                                  fieldKey={[fieldKey, 'value']}
                                  noStyle={true}
                                >
                                  <Input placeholder={'请输入header值'} style={{ width: 399 }} />
                                </Form.Item>
                                <DeleteOutlinedHoverRed onClick={() => remove(name)} />
                              </Space>
                            </Space>
                          </Form.Item>
                        ))}
                        <Button
                          size={'small'}
                          type={'primary'}
                          icon={<PlusOutlined />}
                          onClick={() => add({ name: '', value: '' })}
                        >
                          添加请求头
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
                <Form.Item label={'Cookie'}>
                  <Form.List name={'cookies'}>
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <Form.Item style={{ marginBottom: 16 }} key={name}>
                            <Space align={'center'} size={101}>
                              <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                fieldKey={[fieldKey, 'name']}
                                noStyle={true}
                              >
                                <Input placeholder={'请输入cookie名称'} />
                              </Form.Item>
                              <Space>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'value']}
                                  fieldKey={[fieldKey, 'value']}
                                  noStyle={true}
                                >
                                  <Input placeholder={'请输入cookie值'} style={{ width: 399 }} />
                                </Form.Item>
                                <DeleteOutlinedHoverRed onClick={() => remove(name)} />
                              </Space>
                            </Space>
                          </Form.Item>
                        ))}
                        <Button
                          size={'small'}
                          type={'primary'}
                          icon={<PlusOutlined />}
                          onClick={() => add({ name: '', value: '' })}
                        >
                          添加 Cookie
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </>
                    )}
                  </Form.List>
                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    保存
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}
