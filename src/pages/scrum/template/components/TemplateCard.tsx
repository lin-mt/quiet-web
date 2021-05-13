import React, { useState } from 'react';
import { Popconfirm, Space, Switch, Tooltip, Typography } from 'antd';
import { DeleteFilled, EditFilled, SettingFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { deleteTemplate, updateTemplate, templateDetailInfo } from '@/services/scrum/ScrumTemplate';
import TemplateForm from '@/pages/scrum/template/components/TemplateForm';
import TemplateSettingForm from '@/pages/scrum/template/components/TemplateSettingForm';
import type { ScrumTemplate } from '@/services/scrum/EntitiyType';

interface TemplateCardProps {
  template: ScrumTemplate;
  cardSize?: 'default' | 'small';
  editable?: boolean;
  changeSelectable?: boolean;
  afterDeleteAction?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = (props) => {
  const { template, cardSize, editable, changeSelectable, afterDeleteAction } = props;
  const [templateFormVisible, setTemplateFormVisible] = useState<boolean>(false);
  const [templateSettingFormVisible, setTemplateSettingFormVisible] = useState<boolean>(false);
  const [templateSettingFormOnlyRead, setTemplateSettingFormOnlyRead] = useState<boolean>(false);
  const [templateInfo, setTemplateInfo] = useState<ScrumTemplate>(template);

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
    setTemplateFormVisible(true);
  }

  async function handleDeleteClick() {
    await deleteTemplate(templateInfo.id);
    if (afterDeleteAction) {
      afterDeleteAction();
    }
  }

  const enableStateChangeable =
    templateInfo.taskSteps &&
    templateInfo.taskSteps.length > 0 &&
    templateInfo.priorities &&
    templateInfo.priorities.length > 0;

  return (
    <>
      <ProCard
        size={cardSize}
        style={{ height: '100%' }}
        title={templateInfo.name}
        onClick={() => {
          if (!(changeSelectable || editable)) {
            setTemplateSettingFormVisible(true);
            setTemplateSettingFormOnlyRead(true);
          }
        }}
        extra={
          changeSelectable && (
            <Tooltip
              title={enableStateChangeable ? '' : '请先配置模板中任务的详细步骤以及优先级信息'}
            >
              <Switch
                checkedChildren={'启用'}
                unCheckedChildren={'关闭'}
                onChange={handleEnabledChange}
                disabled={!enableStateChangeable}
                defaultChecked={templateInfo.enabled}
              />
            </Tooltip>
          )
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
          template={templateInfo}
          visible={templateSettingFormVisible}
          onCancel={() => setTemplateSettingFormVisible(false)}
          afterAction={reloadTemplateInfo}
        />
      )}
      {templateFormVisible && (
        <TemplateForm
          visible={templateFormVisible}
          updateInfo={templateInfo}
          onCancel={() => setTemplateFormVisible(false)}
          afterAction={reloadTemplateInfo}
        />
      )}
    </>
  );
};
export default TemplateCard;
