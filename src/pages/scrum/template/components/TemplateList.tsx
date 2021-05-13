import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { AppstoreAddOutlined } from '@ant-design/icons';
import TemplateForm from '@/pages/scrum/template/components/TemplateForm';
import TemplateCard from '@/pages/scrum/template/components/TemplateCard';
import type { ScrumTemplate } from '@/services/scrum/EntitiyType';

interface TemplateListProps {
  title: string;
  templates: ScrumTemplate[];
  newTemplate?: boolean;
  changeSelectable?: boolean;
  editable?: boolean;
  cardSize?: 'default' | 'small';
  afterUpdateAction?: () => void;
}

const TemplateList: React.FC<TemplateListProps> = ({
  title,
  templates,
  newTemplate = false,
  changeSelectable = false,
  editable = false,
  afterUpdateAction,
  cardSize,
}) => {
  const addIconDefaultStyle = { fontSize: '36px' };
  const addIconOverStyle = {
    ...addIconDefaultStyle,
    fontSize: '39px',
    color: '#1890ff',
  };
  const newTemplateKey = 'newTemplateKey';

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [templateFormVisible, setTemplateFormVisible] = useState<boolean>(false);
  const [cardTemplates, setCardTemplates] = useState<ScrumTemplate[]>([]);

  useEffect(() => {
    if (newTemplate) {
      const newCard: any = { id: newTemplateKey };
      templates.unshift(newCard);
    }
    setCardTemplates(templates);
  }, [newTemplate, templates]);

  const cardHeight = 168;
  const colSpan = 4;

  return (
    <>
      <ProCard
        wrap={true}
        collapsible={true}
        ghost={true}
        gutter={[16, 16]}
        style={{ marginBottom: 24 }}
        title={title}
      >
        {cardTemplates.map((template) => {
          if (template.id === newTemplateKey) {
            return (
              <ProCard
                colSpan={colSpan}
                key={template.id}
                layout={'center'}
                hoverable={true}
                size={cardSize}
                style={{ height: cardHeight }}
                bodyStyle={{ minHeight: cardHeight }}
                onMouseOver={() => setAddIconStyle(addIconOverStyle)}
                onMouseLeave={() => setAddIconStyle(addIconDefaultStyle)}
                onClick={() => setTemplateFormVisible(true)}
              >
                <AppstoreAddOutlined style={addIconStyle} />
              </ProCard>
            );
          }
          return (
            <ProCard
              hoverable={true}
              colSpan={colSpan}
              key={template.id}
              bodyStyle={{ padding: 0, height: cardHeight }}
            >
              <TemplateCard
                key={template.id}
                template={template}
                cardSize={cardSize}
                editable={editable}
                afterDeleteAction={afterUpdateAction}
                changeSelectable={changeSelectable}
              />
            </ProCard>
          );
        })}
      </ProCard>
      {templateFormVisible && (
        <TemplateForm
          visible={templateFormVisible}
          onCancel={() => setTemplateFormVisible(false)}
          afterAction={afterUpdateAction}
        />
      )}
    </>
  );
};

export default TemplateList;
