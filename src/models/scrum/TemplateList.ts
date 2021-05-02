import { useCallback, useState } from 'react';

export default () => {
  const [templateList] = useState<Record<string, ScrumEntities.ScrumTemplate>>({});

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

  return { templateList, addTemplates, addOrUpdateTemplate };
};
