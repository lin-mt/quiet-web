import React, { useState } from 'react';
import { Form, Popconfirm, Space, Switch, Tooltip, Typography } from 'antd';
import { DeleteFilled, EditFilled, SettingFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { deleteTemplate, updateTemplate, templateDetailInfo } from '@/services/scrum/ScrumTemplate';
import { OperationType } from '@/types/Type';
import TemplateForm from '@/pages/scrum/template/components/TemplateForm';
import TemplateSettingForm from '@/pages/scrum/template/components/TemplateSettingForm';

type TemplateCardProps = {
  template: ScrumEntities.ScrumTemplate;
  cardSize?: 'default' | 'small';
  editable?: boolean;
  changeSelectable?: boolean;
  afterDeleteAction?: () => void;
};

const TemplateCard: React.FC<TemplateCardProps> = (props) => {
  const { template, cardSize, editable, changeSelectable, afterDeleteAction } = props;
  const [templateForm] = Form.useForm();
  const [templateFormVisible, setTemplateFormVisible] = useState<boolean>(false);
  const [templateSettingFormVisible, setTemplateSettingFormVisible] = useState<boolean>(false);
  const [templateSettingFormOnlyRead, setTemplateSettingFormOnlyRead] = useState<boolean>(false);
  const [templateFormOperationType, setTemplateFormOperationType] = useState<OperationType>();
  const [templateInfo, setTemplateInfo] = useState<ScrumEntities.ScrumTemplate>(template);

  async function handleEnabledChange(enabled: boolean) {
    const changeEnabledStateTemplate = templateInfo;
    changeEnabledStateTemplate.enabled = enabled;
    await updateTemplate(changeEnabledStateTemplate);
    await reloadTemplateInfo();
  }

  async function reloadTemplateInfo() {
    setTemplateInfo(await templateDetailInfo(templateInfo.id));
  }

  function handleEditClick() {
    templateForm.setFieldsValue(templateInfo);
    setTemplateFormOperationType(OperationType.UPDATE);
    setTemplateFormVisible(true);
  }

  async function handleDeleteClick() {
    await deleteTemplate(templateInfo.id);
    if (afterDeleteAction) {
      afterDeleteAction();
    }
  }

  return (
    <>
      <ProCard
        size={cardSize}
        title={templateInfo.name}
        style={{ height: '100%' }}
        onClick={() => {
          if (!(changeSelectable || editable)) {
            setTemplateSettingFormVisible(true);
            setTemplateSettingFormOnlyRead(true);
          }
        }}
        extra={
          changeSelectable &&
          (templateInfo.taskSteps && templateInfo.taskSteps.length > 0 ? (
            <Switch
              checkedChildren="启用"
              unCheckedChildren="关闭"
              onChange={handleEnabledChange}
              disabled={!(templateInfo.taskSteps && templateInfo.taskSteps.length > 0)}
              defaultChecked={templateInfo.enabled}
            />
          ) : (
            <Tooltip title={'请先配置模板中任务的详细步骤'}>
              <Switch
                unCheckedChildren="关闭"
                disabled={!(templateInfo.taskSteps && templateInfo.taskSteps.length > 0)}
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
                  }}
                />,
                <EditFilled key={'edit'} onClick={handleEditClick} />,
                <Popconfirm
                  placement={'bottom'}
                  title={`确定删除模板 ${templateInfo.name} 吗?`}
                  onConfirm={handleDeleteClick}
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
              tooltip: templateInfo.remark,
            }}
          >
            {templateInfo.remark}
          </Typography.Paragraph>
        </Space>
      </ProCard>
      {templateSettingFormVisible && (
        <TemplateSettingForm
          readOnly={templateSettingFormOnlyRead}
          currentTemplate={templateInfo}
          visible={templateSettingFormVisible}
          onCancel={() => setTemplateSettingFormVisible(false)}
          afterAction={reloadTemplateInfo}
        />
      )}
      {templateFormVisible && (
        <TemplateForm
          visible={templateFormVisible}
          form={templateForm}
          updateInfo={templateInfo}
          operationType={templateFormOperationType}
          onCancel={() => setTemplateFormVisible(false)}
          afterAction={reloadTemplateInfo}
        />
      )}
    </>
  );
};
export default TemplateCard;
