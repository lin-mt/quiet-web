import { useState } from 'react';

export default () => {
  const [templates, setTemplates] = useState<Record<string, ScrumEntities.ScrumTemplate>>({});

  return { templates, setTemplates };
};
