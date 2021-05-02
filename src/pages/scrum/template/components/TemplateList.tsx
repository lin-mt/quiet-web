import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import TemplateForm from '@/pages/scrum/template/components/TemplateForm';
import { buildFullCard } from '@/utils/RenderUtils';
import TemplateCard from '@/pages/scrum/template/components/TemplateCard';

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

const ProjectList: React.FC<TemplateListProps> = ({
  title,
  templates,
  templateNum = 5,
  newTemplate = false,
  changeSelectable = false,
  editable = false,
  afterUpdateAction,
  cardSize,
}) => {
  const addIconDefaultStyle = { fontSize: '36px' };
  const addIconOverStyle = {
    ...addIconDefaultStyle,
    color: '#1890ff',
  };
  const newTemplateKey = 'newTemplateKey';

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [templateFormVisible, setTemplateFormVisible] = useState<boolean>(false);
  const [cardTemplates, setCardProjects] = useState<CardTemplateInfo[]>([]);
  const [templateForm] = Form.useForm();

  useEffect(() => {
    setCardProjects(buildFullCard(templates, templateNum, newTemplate, newTemplateKey));
  }, [newTemplate, templateNum, templates]);

  function handleNewTemplateClick() {
    setTemplateFormVisible(true);
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
            <ProCard hoverable={true} key={template.id} bodyStyle={{ padding: 0 }}>
              <TemplateCard
                template={template}
                cardSize={cardSize}
                editable={editable}
                afterDeleteAction={afterUpdateAction}
                changeSelectable={changeSelectable}
              />
            </ProCard>
          ) : (
            <ProCard key={template.key} style={{ visibility: 'hidden' }} />
          );
        })}
      </ProCard>
      {templateFormVisible && (
        <TemplateForm
          visible={templateFormVisible}
          form={templateForm}
          onCancel={() => setTemplateFormVisible(false)}
          afterAction={afterUpdateAction}
        />
      )}
    </>
  );
};

export default ProjectList;
