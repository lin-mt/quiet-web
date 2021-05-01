import { useState } from 'react';

export default () => {
  const [projectId, setProjectId] = useState<string>();
  const [versions, setVersions] = useState<ScrumEntities.ScrumVersion[]>([]);

  return { projectId, setProjectId, versions, setVersions };
};
