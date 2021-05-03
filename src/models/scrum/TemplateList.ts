import { useState } from 'react';
import type { ScrumTemplate } from '@/services/scrum/EntitiyType';

export default () => {
  const [templates, setTemplates] = useState<Record<string, ScrumTemplate>>({});

  return { templates, setTemplates };
};
