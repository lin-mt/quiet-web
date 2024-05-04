import { deleteRequirement, updateRequirement } from '@/services/quiet/requirementController';
import { IdName, IdUsername } from '@/util/Utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Card, Flex, Form, Popconfirm, Typography } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import styles from './index.less';

const { Text, Title } = Typography;

type RequirementCardProps = {
  style?: CSSProperties;
  projectDetail: API.ProjectDetail;
  template: API.TemplateDetail;
  requirement: API.RequirementVO;
  afterDelete?: () => void;
  afterUpdate?: (newReq: API.RequirementVO) => void;
};

function RequirementCard(props: RequirementCardProps) {
  const [updateForm] = Form.useForm();

  const { projectDetail, template } = props;

  const [requirement, setRequirement] = useState<API.RequirementVO>(props.requirement);

  useEffect(() => {
    setRequirement(props.requirement);
  }, [props.requirement]);

  return (
    <Card
      hoverable
      size="small"
      className={styles.requirementCard}
      styles={{
        body: {
          padding: 6,
          height: 80,
        },
      }}
      style={{
        borderColor: template.requirementPriorities.find((p) => p.id === requirement.priorityId)
          ?.color,
        ...props.style,
      }}
    >
      <Flex vertical gap={2}>
        <Flex justify="space-between" align="center">
          <Title
            level={5}
            style={{ margin: 0, fontSize: 13, fontWeight: 500 }}
            ellipsis={{ tooltip: requirement.title }}
          >
            {requirement.title}
          </Title>
          <div>
            <ModalForm<API.UpdateRequirement>
              key={'update'}
              form={updateForm}
              title={'更新需求'}
              layout={'horizontal'}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              submitter={{
                render: (_, defaultDom) => {
                  return [
                    <Button
                      key="reset"
                      onClick={() => {
                        updateForm.resetFields();
                      }}
                    >
                      重置
                    </Button>,
                    ...defaultDom,
                  ];
                },
              }}
              trigger={
                <Button
                  size="small"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => updateForm.setFieldsValue({ ...requirement })}
                />
              }
              onFinish={async (values) => {
                const newRequirement = { ...requirement, ...values };
                await updateRequirement(newRequirement).then(() => {
                  if (props.afterUpdate) {
                    props.afterUpdate(newRequirement);
                  }
                });
                updateForm.setFieldsValue(values);
                setRequirement(newRequirement);
                return true;
              }}
            >
              <ProFormText name={'title'} label={'标题'} rules={[{ required: true, max: 30 }]} />
              <ProFormSelect
                name={'typeId'}
                label={'类型'}
                rules={[{ required: true }]}
                options={template.requirementTypes}
                fieldProps={{ fieldNames: IdName }}
              />
              <ProFormSelect
                name={'priorityId'}
                label={'优先级'}
                rules={[{ required: true }]}
                options={template.requirementPriorities}
                fieldProps={{ fieldNames: IdName }}
              />
              <ProFormSelect
                name={'reporterId'}
                label={'报告人'}
                rules={[{ required: true }]}
                options={projectDetail.members}
                fieldProps={{ fieldNames: IdUsername }}
              />
              <ProFormSelect
                name={'handlerId'}
                label={'处理人'}
                rules={[{ required: true }]}
                options={projectDetail.members}
                fieldProps={{ fieldNames: IdUsername }}
              />
              <ProFormTextArea name={'description'} label={'描述'} rules={[{ max: 255 }]} />
            </ModalForm>
            <Popconfirm
              title={'确定删除该需求吗'}
              onConfirm={() => {
                deleteRequirement({ id: requirement.id }).then(() => {
                  if (props.afterDelete) {
                    props.afterDelete();
                  }
                });
              }}
            >
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        </Flex>
        <Text style={{ fontSize: 12 }}>
          类型：{template.requirementTypes.find((t) => t.id === requirement.typeId)?.name}
        </Text>
        <Text style={{ fontSize: 12 }} ellipsis={{ tooltip: requirement.description }}>
          描述：{requirement.description || '-'}
        </Text>
      </Flex>
    </Card>
  );
}

export default RequirementCard;
