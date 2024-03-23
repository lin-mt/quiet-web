import {
  addTemplate,
  deleteTemplate,
  getTemplateDetail,
  pageTemplate,
  updateTemplate,
} from '@/services/quiet/templateController';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Col, ColorPicker, Form, Input, Popconfirm, Row } from 'antd';
import React, { useRef } from 'react';

const TemplateManagement: React.FC = () => {
  const ref = useRef<ActionType>();
  const [form] = Form.useForm<API.AddTemplate>();
  const [editForm] = Form.useForm<API.UpdateTemplate>();

  const columns: ProColumns<API.TemplateVO>[] = [
    {
      title: 'ID',
      valueType: 'text',
      dataIndex: 'id',
      copyable: true,
      editable: false,
    },
    {
      title: '模板名称',
      valueType: 'text',
      dataIndex: 'name',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '描述',
      search: false,
      valueType: 'text',
      dataIndex: 'description',
    },
    {
      title: '操作',
      disable: true,
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <ModalForm<API.UpdateTemplate>
          form={editForm}
          key={'edit'}
          width={900}
          title={'编辑模板'}
          layout={'horizontal'}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          trigger={
            <a
              key="edit"
              onClick={() => {
                getTemplateDetail({ id: record.id }).then((resp) => editForm.setFieldsValue(resp));
              }}
            >
              编辑
            </a>
          }
          submitter={{
            render: (_, defaultDom) => {
              return [
                <Button
                  key="reset"
                  onClick={() => {
                    editForm.resetFields();
                  }}
                >
                  重置
                </Button>,
                ...defaultDom,
              ];
            },
          }}
          onFinish={(formData) =>
            updateTemplate(formData).then(() => {
              editForm.resetFields();
              ref.current?.reload();
              return true;
            })
          }
        >
          <ProFormText name={'id'} label={'模板ID'} readonly />
          <ProFormText name={'name'} label={'模板名称'} rules={[{ required: true, max: 30 }]} />
          <Form.Item label={'需求类型'} required>
            <Form.List name="requirementTypes">
              {(fields, { add, remove, move }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Row key={key} justify="space-around" align="middle" gutter={10}>
                      <Col flex={'auto'}>
                        <Row gutter={10}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              rules={[
                                { required: true, message: '请输入类型名称' },
                                { max: 30, message: '类型名称不能超过 30 个字符' },
                              ]}
                            >
                              <Input placeholder="请输入类型名称" />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              {...restField}
                              name={[name, 'description']}
                              rules={[{ max: 255 }]}
                            >
                              <Input.TextArea rows={1} placeholder="请输入描述信息" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      <Col flex={'88px'}>
                        <Row gutter={10}>
                          <Col span={12}>
                            <Form.Item>
                              <Button
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item>
                              <Button
                                shape="circle"
                                onClick={() => move(index, index + (index === 0 ? 1 : -1))}
                                icon={index === 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加需求类型
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item label={'任务类型'} required>
            <Form.List name="taskTypes">
              {(fields, { add, remove, move }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Row key={key} justify="space-around" align="middle" gutter={10}>
                      <Col flex={'auto'}>
                        <Row gutter={10}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              rules={[
                                { required: true, message: '请输入类型名称' },
                                { max: 30, message: '类型名称不能超过 30 个字符' },
                              ]}
                            >
                              <Input placeholder="请输入类型名称" />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              {...restField}
                              name={[name, 'description']}
                              rules={[{ max: 255 }]}
                            >
                              <Input.TextArea rows={1} placeholder="请输入描述信息" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      <Col flex={'88px'}>
                        <Row gutter={10}>
                          <Col span={12}>
                            <Form.Item>
                              <Button
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item>
                              <Button
                                shape="circle"
                                onClick={() => move(index, index + (index === 0 ? 1 : -1))}
                                icon={index === 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加任务类型
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item label={'任务步骤'} required>
            <Form.List name="taskSteps">
              {(fields, { add, remove, move }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Row key={key} justify="space-around" align="middle" gutter={10}>
                      <Col flex={'auto'}>
                        <Row gutter={10}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              rules={[
                                { required: true, message: '请输入步骤名称' },
                                { max: 30, message: '步骤名称不能超过 30 个字符' },
                              ]}
                            >
                              <Input placeholder="请输入步骤名称" />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              {...restField}
                              name={[name, 'description']}
                              rules={[{ max: 255 }]}
                            >
                              <Input.TextArea rows={1} placeholder="请输入描述信息" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      <Col flex={'88px'}>
                        <Row gutter={10}>
                          <Col span={12}>
                            <Form.Item>
                              <Button
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item>
                              <Button
                                shape="circle"
                                onClick={() => move(index, index + (index === 0 ? 1 : -1))}
                                icon={index === 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加步骤
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item label={'任务优先级'} required>
            <Form.List name="requirementPriorities">
              {(fields, { add, remove, move }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Row key={key} justify="space-around" align="middle" gutter={10}>
                      <Col flex={'auto'}>
                        <Row gutter={10}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              rules={[
                                { required: true, message: '请输入优先级名称' },
                                { max: 30, message: '优先级名称不能超过 30 个字符' },
                              ]}
                            >
                              <Input placeholder="请输入优先级名称" />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Row gutter={10}>
                              <Col flex={'32px'}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'color']}
                                  rules={[{ required: true, message: '颜色' }]}
                                >
                                  <ColorPicker />
                                </Form.Item>
                              </Col>
                              <Col flex={'auto'}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'description']}
                                  rules={[{ max: 255 }]}
                                >
                                  <Input.TextArea rows={1} placeholder="请输入描述信息" />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col flex={'88px'}>
                        <Row gutter={10}>
                          <Col span={12}>
                            <Form.Item>
                              <Button
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item>
                              <Button
                                shape="circle"
                                onClick={() => move(index, index + (index === 0 ? 1 : -1))}
                                icon={index === 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加优先级
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
          <ProFormTextArea name={'description'} label={'描述'} rules={[{ max: 255 }]} />
        </ModalForm>,
        <Popconfirm
          key={'delete'}
          title="删除模板"
          style={{ width: '100vw' }}
          onConfirm={() => {
            deleteTemplate({ id: record.id }).then(() => ref.current?.reload());
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProTable<API.TemplateVO>
        bordered
        cardBordered
        rowKey={'id'}
        actionRef={ref}
        columns={columns}
        request={(params) => pageTemplate({ pageTemplate: params })}
        columnsState={{
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
        }}
        toolBarRender={() => [
          <ModalForm<API.AddTemplate>
            form={form}
            key={'add'}
            title={'新建模板'}
            layout={'horizontal'}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            trigger={
              <Button key={'add'} icon={<PlusOutlined />} type={'primary'}>
                新建模板
              </Button>
            }
            onOpenChange={() => {
              form.resetFields();
            }}
            submitter={{
              render: (_, defaultDom) => {
                return [
                  <Button
                    key="reset"
                    onClick={() => {
                      form.resetFields();
                    }}
                  >
                    重置
                  </Button>,
                  ...defaultDom,
                ];
              },
            }}
            onFinish={(formData) => {
              formData.requirementPriorities.forEach((r) => {
                const t: any = r.color;
                r.color = t.toHexString();
              });
              return addTemplate(formData).then(() => {
                form.resetFields();
                ref.current?.reload();
                return true;
              });
            }}
          >
            <ProFormText name={'name'} label={'模板名称'} rules={[{ required: true, max: 30 }]} />
            <Form.Item label={'需求类型'} required>
              <Form.List name="requirementTypes">
                {(fields, { add, remove, move }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row key={key} justify="space-around" align="middle" gutter={10}>
                        <Col flex={'auto'}>
                          <Row gutter={10}>
                            <Col span={8}>
                              <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                rules={[
                                  { required: true, message: '请输入类型名称' },
                                  { max: 30, message: '类型名称不能超过 30 个字符' },
                                ]}
                              >
                                <Input placeholder="请输入类型名称" />
                              </Form.Item>
                            </Col>
                            <Col span={16}>
                              <Form.Item
                                {...restField}
                                name={[name, 'description']}
                                rules={[{ max: 255 }]}
                              >
                                <Input.TextArea rows={1} placeholder="请输入描述信息" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={'88px'}>
                          <Row gutter={10}>
                            <Col span={12}>
                              <Form.Item>
                                <Button
                                  danger
                                  shape="circle"
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(name)}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item>
                                <Button
                                  shape="circle"
                                  onClick={() => move(index, index + (index === 0 ? 1 : -1))}
                                  icon={index === 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加需求类型
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label={'任务类型'} required>
              <Form.List name="taskTypes">
                {(fields, { add, remove, move }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row key={key} justify="space-around" align="middle" gutter={10}>
                        <Col flex={'auto'}>
                          <Row gutter={10}>
                            <Col span={8}>
                              <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                rules={[
                                  { required: true, message: '请输入类型名称' },
                                  { max: 30, message: '类型名称不能超过 30 个字符' },
                                ]}
                              >
                                <Input placeholder="请输入类型名称" />
                              </Form.Item>
                            </Col>
                            <Col span={16}>
                              <Form.Item
                                {...restField}
                                name={[name, 'description']}
                                rules={[{ max: 255 }]}
                              >
                                <Input.TextArea rows={1} placeholder="请输入描述信息" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={'88px'}>
                          <Row gutter={10}>
                            <Col span={12}>
                              <Form.Item>
                                <Button
                                  danger
                                  shape="circle"
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(name)}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item>
                                <Button
                                  shape="circle"
                                  onClick={() => move(index, index + (index === 0 ? 1 : -1))}
                                  icon={index === 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加任务类型
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label={'任务步骤'} required>
              <Form.List name="taskSteps">
                {(fields, { add, remove, move }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row key={key} justify="space-around" align="middle" gutter={10}>
                        <Col flex={'auto'}>
                          <Row gutter={10}>
                            <Col span={8}>
                              <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                rules={[
                                  { required: true, message: '请输入步骤名称' },
                                  { max: 30, message: '步骤名称不能超过 30 个字符' },
                                ]}
                              >
                                <Input placeholder="请输入步骤名称" />
                              </Form.Item>
                            </Col>
                            <Col span={16}>
                              <Form.Item
                                {...restField}
                                name={[name, 'description']}
                                rules={[{ max: 255 }]}
                              >
                                <Input.TextArea rows={1} placeholder="请输入描述信息" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={'88px'}>
                          <Row gutter={10}>
                            <Col span={12}>
                              <Form.Item>
                                <Button
                                  danger
                                  shape="circle"
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(name)}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item>
                                <Button
                                  shape="circle"
                                  onClick={() => move(index, index + (index === 0 ? 1 : -1))}
                                  icon={index === 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加步骤
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label={'任务优先级'} required>
              <Form.List name="requirementPriorities">
                {(fields, { add, remove, move }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row key={key} justify="space-around" align="middle" gutter={10}>
                        <Col flex={'auto'}>
                          <Row gutter={10}>
                            <Col span={8}>
                              <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                rules={[
                                  { required: true, message: '请输入优先级名称' },
                                  { max: 30, message: '优先级名称不能超过 30 个字符' },
                                ]}
                              >
                                <Input placeholder="请输入优先级名称" />
                              </Form.Item>
                            </Col>
                            <Col span={16}>
                              <Row gutter={10}>
                                <Col flex={'32px'}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'color']}
                                    rules={[{ required: true, message: '颜色' }]}
                                  >
                                    <ColorPicker
                                      onChange={(color) => {
                                        console.log(color.toHexString());

                                        form.setFieldValue(
                                          `requirementPriorities[${index}].color`,
                                          color.toHexString(),
                                        );
                                      }}
                                    />
                                  </Form.Item>
                                </Col>
                                <Col flex={'auto'}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'description']}
                                    rules={[{ max: 255 }]}
                                  >
                                    <Input.TextArea rows={1} placeholder="请输入描述信息" />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={'88px'}>
                          <Row gutter={10}>
                            <Col span={12}>
                              <Form.Item>
                                <Button
                                  danger
                                  shape="circle"
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(name)}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item>
                                <Button
                                  shape="circle"
                                  onClick={() => move(index, index + (index === 0 ? 1 : -1))}
                                  icon={index === 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加优先级
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <ProFormTextArea name={'description'} label={'描述'} rules={[{ max: 255 }]} />
          </ModalForm>,
        ]}
      />
    </PageContainer>
  );
};

export default TemplateManagement;
