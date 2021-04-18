import React, { useEffect, useState } from 'react';
import { allTemplates } from '@/services/scrum/ScrumTemplate';
import TemplateList from '@/pages/scrum/template/components/TemplateList';

const Project: React.FC<any> = () => {
  const [templateCreated, setTemplateCreated] = useState<ScrumEntities.ScrumTemplate[]>([]);
  const [templateSelectable, setTemplateSelectable] = useState<ScrumEntities.ScrumTemplate[]>([]);

  function loadAllTemplate() {
    allTemplates().then((resp) => {
      setTemplateCreated(resp.templateCreated);
      setTemplateSelectable(resp.templateSelectable);
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
        canConfigTaskStep={true}
        canEdit={true}
        canDelete={true}
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
