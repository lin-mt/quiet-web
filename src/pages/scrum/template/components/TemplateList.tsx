import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { AppstoreAddOutlined, DeleteFilled, EditFilled, SettingFilled } from '@ant-design/icons';
import { Form, Popconfirm, Space, Switch, Tooltip, Typography } from 'antd';
import { OperationType } from '@/types/Type';
import { deleteTemplate, updateTemplate } from '@/services/scrum/ScrumTemplate';
import TemplateForm from '@/pages/scrum/template/components/TemplateForm';
import { buildFullCard } from '@/utils/utils';
import TemplateSettingForm from '@/pages/scrum/template/components/TemplateSettingForm';

type TemplateListProps = {
  title: string;
  templates: ScrumEntities.ScrumTemplate[];
  templateNum?: number;
  newTemplate?: boolean;
  changeSelectable?: boolean;
  editable?: boolean;
  cardSize?: 'default' | 'small';
  afterUpdateAction?: () => void;
};

type CardTemplateInfo = ScrumEntities.ScrumTemplate & {
  key: string;
};

const ProjectList: React.FC<TemplateListProps> = (props) => {
  const {
    title,
    templates,
    templateNum = 5,
    newTemplate = false,
    changeSelectable = false,
    editable = false,
    afterUpdateAction,
    cardSize,
  } = props;

  const addIconDefaultStyle = { fontSize: '36px' };

  const addIconOverStyle = {
    ...addIconDefaultStyle,
    color: '#1890ff',
  };
  const newTemplateKey = 'newTemplateKey';
  const [form] = Form.useForm();

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [templateFormVisible, setTemplateFormVisible] = useState<boolean>(false);
  const [templateSettingFormOnlyRead, setTemplateSettingFormOnlyRead] = useState<boolean>(false);
  const [templateSettingFormVisible, setTemplateSettingFormVisible] = useState<boolean>(false);
  const [templateFormOperationType, setTemplateFormOperationType] = useState<OperationType>();
  const [cardTemplates, setCardProjects] = useState<CardTemplateInfo[]>([]);
  const [updateInfo, setUpdateInfo] = useState<ScrumEntities.ScrumTemplate>();

  useEffect(() => {
    setCardProjects(buildFullCard(templates, templateNum, newTemplate, newTemplateKey));
  }, [newTemplate, templateNum, templates]);

  function handleNewTemplateClick() {
    setTemplateFormVisible(true);
    setTemplateFormOperationType(OperationType.CREATE);
  }

  function handleEditClick(template: ScrumEntities.ScrumTemplate) {
    form.setFieldsValue(template);
    setUpdateInfo(template);
    setTemplateFormOperationType(OperationType.UPDATE);
    setTemplateFormVisible(true);
  }

  async function handleDeleteClick(template: CardTemplateInfo) {
    await deleteTemplate(template.id);
    if (afterUpdateAction) {
      afterUpdateAction();
    }
  }

  async function handleEnableChange(template: CardTemplateInfo, enable: boolean) {
    const changeEnableStateTemplate = template;
    changeEnableStateTemplate.enable = enable;
    await updateTemplate(changeEnableStateTemplate);
    if (afterUpdateAction) {
      afterUpdateAction();
    }
  }

  return (
    <>
      <ProCard gutter={24} ghost style={{ marginBottom: '24px' }} title={title} collapsible>
        {cardTemplates.map((template) => {
          if (template.key === newTemplateKey) {
            return (
              <ProCard
                key={template.key}
                layout={'center'}
                hoverable={true}
                size={cardSize}
                style={{ minHeight: '168px' }}
                onMouseOver={() => setAddIconStyle(addIconOverStyle)}
                onMouseLeave={() => setAddIconStyle(addIconDefaultStyle)}
                onClick={handleNewTemplateClick}
              >
                <AppstoreAddOutlined style={addIconStyle} />
              </ProCard>
            );
          }
          return template.id ? (
            <ProCard
              hoverable={true}
              key={template.id}
              title={template.name}
              size={cardSize}
              onClick={() => {
                if (!(changeSelectable || editable)) {
                  setTemplateSettingFormVisible(true);
                  setTemplateSettingFormOnlyRead(true);
                  setUpdateInfo(template);
                }
              }}
              extra={
                changeSelectable &&
                (template.taskSteps && template.taskSteps.length > 0 ? (
                  <Switch
                    checkedChildren="启用"
                    unCheckedChildren="关闭"
                    onChange={(enable) => handleEnableChange(template, enable)}
                    disabled={!(template.taskSteps && template.taskSteps.length > 0)}
                    defaultChecked={template.enable}
                  />
                ) : (
                  <Tooltip title={'请先配置模板中任务的详细步骤'}>
                    <Switch
                      unCheckedChildren="关闭"
                      disabled={!(template.taskSteps && template.taskSteps.length > 0)}
                    />
                  </Tooltip>
                ))
              }
              actions={
                !editable
                  ? undefined
                  : [
                      <SettingFilled
                        key={'setting'}
                        onClick={() => {
                          setTemplateSettingFormVisible(true);
                          setTemplateSettingFormOnlyRead(false);
                          setUpdateInfo(template);
                        }}
                      />,
                      <EditFilled key={'edit'} onClick={() => handleEditClick(template)} />,
                      <Popconfirm
                        placement={'bottom'}
                        title={`确定删除模板 ${template.name} 吗?`}
                        onConfirm={() => handleDeleteClick(template)}
                      >
                        <DeleteFilled
                          key={'delete'}
                          onMouseOver={(event) => {
                            // eslint-disable-next-line no-param-reassign
                            event.currentTarget.style.color = 'red';
                          }}
                          onMouseLeave={(event) => {
                            // eslint-disable-next-line no-param-reassign
                            event.currentTarget.style.color = 'rgba(0, 0, 0, 0.45)';
                          }}
                        />
                      </Popconfirm>,
                    ]
              }
            >
              <Space direction={'vertical'}>
                <Typography.Paragraph
                  type={'secondary'}
                  ellipsis={{
                    rows: 1,
                    tooltip: template.remark,
                  }}
                >
                  {template.remark}
                </Typography.Paragraph>
              </Space>
            </ProCard>
          ) : (
            <ProCard key={template.key} style={{ backgroundColor: '#f0f2f5' }} />
          );
        })}
      </ProCard>
      {templateSettingFormVisible && updateInfo && (
        <TemplateSettingForm
          readOnly={templateSettingFormOnlyRead}
          currentTemplate={updateInfo}
          taskSteps={updateInfo.taskSteps}
          visible={templateSettingFormVisible}
          onCancel={() => setTemplateSettingFormVisible(false)}
          afterAction={afterUpdateAction}
        />
      )}
      {templateFormVisible && (
        <TemplateForm
          visible={templateFormVisible}
          form={form}
          updateInfo={updateInfo}
          operationType={templateFormOperationType}
          onCancel={() => setTemplateFormVisible(false)}
          afterAction={afterUpdateAction}
        />
      )}
    </>
  );
};

export default ProjectList;
