import { useCallback, useState } from 'react';

export default () => {
  const [templateList, setTemplateList] = useState<Record<string, ScrumEntities.ScrumTemplate>>({});

  const addOrUpdateTemplate = useCallback(
    (template: ScrumEntities.ScrumTemplate) => {
      templateList[template.id] = template;
    },
    [templateList],
  );

  const addTemplates = useCallback(
    (templates: ScrumEntities.ScrumTemplate[]) => {
      templates.forEach((template) => {
        templateList[template.id] = template;
      });
    },
    [templateList],
  );

  const deleteTemplate = useCallback(
    (id: string): void => {
      const newTemplateList: Record<string, ScrumEntities.ScrumTemplate> = {};
      Object.keys(templateList).forEach((key) => {
        if (key !== id) {
          newTemplateList[key] = templateList[key];
        }
      });
      setTemplateList(newTemplateList);
    },
    [templateList],
  );

  return { templateList, addTemplates, addOrUpdateTemplate, deleteTemplate };
};
