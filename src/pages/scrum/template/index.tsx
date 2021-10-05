import React, { useEffect, useState } from 'react';
import { allTemplates } from '@/services/scrum/ScrumTemplate';
import TemplateList from '@/pages/scrum/template/components/TemplateList';
import type { ScrumTemplate } from '@/services/scrum/EntitiyType';

const Project: React.FC<any> = () => {
  const [templateCreated, setTemplateCreated] = useState<ScrumTemplate[]>([]);
  const [templateSelectable, setTemplateSelectable] = useState<ScrumTemplate[]>([]);

  function loadAllTemplate() {
    allTemplates().then((resp) => {
      setTemplateCreated(resp.template_created);
      setTemplateSelectable(resp.template_selectable);
    });
  }

  useEffect(() => {
    loadAllTemplate();
  }, []);

  return (
    <>
      <TemplateList
        title={'创建的模板'}
        templates={templateCreated}
        newTemplate={true}
        changeSelectable={true}
        editable={true}
        cardSize={'small'}
        afterUpdateAction={loadAllTemplate}
      />
      {templateSelectable.length > 0 && (
        <TemplateList title={'可选的模板'} templates={templateSelectable} />
      )}
    </>
  );
};
export default Project;
