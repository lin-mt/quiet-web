import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Input,
  Modal,
  Space,
  Typography,
} from '@arco-design/web-react';
import { QuietFormProps } from '@/components/type';
import { ScrumTemplate } from '@/service/scrum/type';
import {
  IconArrowFall,
  IconArrowRise,
  IconDelete,
  IconPlus,
} from '@arco-design/web-react/icon';
import ColorPicker from '@/components/ColorPicker';
import { listPriority } from '@/service/scrum/priority';
import { listTaskStep } from '@/service/scrum/task-step';
const { Row, Col } = Grid;
const { useForm } = Form;

export type TemplateFormProps = QuietFormProps<ScrumTemplate>;

function TemplateForm(props: TemplateFormProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  useEffect(() => {
    if (props.formValues) {
      form.setFieldsValue(props.formValues);
      fetchPriorityAndTaskStep();
    } else {
      form.setFieldsValue(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.formValues]);

  function fetchPriorityAndTaskStep() {
    listPriority(props.formValues.id).then((resp) => {
      form.setFieldValue('priorities', resp);
    });
    listTaskStep(props.formValues.id).then((resp) => {
      form.setFieldValue('task_steps', resp);
    });
  }

  function handleOk() {
    if (props.onOk) {
      form.validate().then(async (values) => {
        setSubmitting(true);
        props
          .onOk(values)
          .catch(() => {
            fetchPriorityAndTaskStep();
          })
          .finally(() => {
            setSubmitting(false);
          });
      });
    }
  }

  function handleCancel() {
    if (props.onCancel) {
      props.onCancel();
    }
  }

  return (
    <Modal
      style={{ width: 900 }}
      title={props.title}
      visible={props.visible}
      onOk={handleOk}
      okText={props.okText}
      onCancel={handleCancel}
      cancelText={props.cancelText}
      afterClose={() => {
        form.resetFields();
      }}
      confirmLoading={submitting}
    >
      <Form
        form={form}
        id={'template-form'}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      >
        {props.formValues && (
          <>
            <Form.Item field="id" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item label="模板ID" field="id">
              <Typography.Text copyable>{props.formValues.id}</Typography.Text>
            </Form.Item>
          </>
        )}
        <Form.Item
          label="模板名称"
          field="name"
          rules={[
            { required: true, message: '请输入模板名称' },
            { maxLength: 10, message: '名称的长度不能超过 10' },
          ]}
        >
          <Input placeholder="请输入模板名称" />
        </Form.Item>
        <Form.Item label="任务步骤">
          <Form.List field="task_steps">
            {(fields, { add, remove, move }) => {
              return (
                <div>
                  {fields.map((item, index) => {
                    return (
                      <Grid.Row key={item.key} gutter={10}>
                        <Col flex={'auto'}>
                          <Row gutter={10}>
                            <Col span={11}>
                              <Form.Item hidden field={item.field + '.id'}>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                field={item.field + '.name'}
                                label={`步骤 ${index + 1}`}
                                rules={[
                                  {
                                    required: true,
                                    message: '步骤名称不能为空',
                                  },
                                  {
                                    maxLength: 10,
                                    message: '步骤名称的长度不能超过 10',
                                  },
                                ]}
                              >
                                <Input placeholder={'请输入步骤名称'} />
                              </Form.Item>
                            </Col>
                            <Col span={13}>
                              <Form.Item
                                field={item.field + '.remark'}
                                rules={[
                                  {
                                    maxLength: 30,
                                    message: '备注信息的长度不能超过 30',
                                  },
                                ]}
                              >
                                <Input.TextArea
                                  rows={1}
                                  placeholder={'请输入备注信息'}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={'84px'}>
                          <Space size={10}>
                            <Button
                              icon={<IconDelete />}
                              shape="circle"
                              status="danger"
                              onClick={() => remove(index)}
                            />
                            <Button
                              shape="circle"
                              onClick={() =>
                                move(index, index > 0 ? index - 1 : index + 1)
                              }
                            >
                              {index > 0 ? (
                                <IconArrowRise />
                              ) : (
                                <IconArrowFall />
                              )}
                            </Button>
                          </Space>
                        </Col>
                      </Grid.Row>
                    );
                  })}
                  <Button
                    icon={<IconPlus />}
                    onClick={() => {
                      add();
                    }}
                  >
                    添加步骤
                  </Button>
                </div>
              );
            }}
          </Form.List>
        </Form.Item>
        <Form.Item label="需求优先级">
          <Form.List field="priorities">
            {(fields, { add, remove, move }) => {
              return (
                <div>
                  {fields.map((item, index) => {
                    return (
                      <Grid.Row key={item.key} gutter={10}>
                        <Col flex={'auto'}>
                          <Row gutter={10}>
                            <Col span={8}>
                              <Form.Item hidden field={item.field + '.id'}>
                                <Input />
                              </Form.Item>
                              <Form.Item
                                field={item.field + '.name'}
                                rules={[
                                  // {
                                  //   required: true,
                                  //   message: '优先级名称不能为空',
                                  // },
                                  {
                                    maxLength: 10,
                                    message: '优先级名称的长度不能超过 10',
                                  },
                                ]}
                              >
                                <Input placeholder={'请输入优先级名称'} />
                              </Form.Item>
                            </Col>
                            <Col span={16}>
                              <Form.Item
                                field={item.field + '.remark'}
                                rules={[
                                  {
                                    maxLength: 30,
                                    message: '备注信息的长度不能超过 30',
                                  },
                                ]}
                              >
                                <Input.TextArea
                                  rows={1}
                                  placeholder={'请输入备注信息'}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col flex={'32px'}>
                          <Form.Item field={item.field + '.color_hex'}>
                            <ColorPicker />
                          </Form.Item>
                        </Col>
                        <Col flex={'74px'}>
                          <Space size={10}>
                            <Button
                              icon={<IconDelete />}
                              shape="circle"
                              status="danger"
                              onClick={() => remove(index)}
                            />
                            <Button
                              shape="circle"
                              onClick={() =>
                                move(index, index > 0 ? index - 1 : index + 1)
                              }
                            >
                              {index > 0 ? (
                                <IconArrowRise />
                              ) : (
                                <IconArrowFall />
                              )}
                            </Button>
                          </Space>
                        </Col>
                      </Grid.Row>
                    );
                  })}
                  <Button
                    icon={<IconPlus />}
                    onClick={() => {
                      add({ color_hex: '#3491FA' });
                    }}
                  >
                    添加优先级
                  </Button>
                </div>
              );
            }}
          </Form.List>
        </Form.Item>
        <Form.Item
          label="备注"
          field="remark"
          rules={[{ maxLength: 30, message: '备注信息长度不能超过 30' }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 2 }}
            placeholder="请输入模板备注"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TemplateForm;
