import { useState } from 'react';

export default () => {
  const [projectId, setProjectId] = useState<string>();
  const [versions, setVersions] = useState<ScrumEntities.ScrumVersion[]>([]);
  const [members, setMembers] = useState<Record<string, SystemEntities.QuietUser>>({});
  const [priorities, setPriorities] = useState<ScrumEntities.ScrumPriority[]>([]);

  return {
    projectId,
    setProjectId,
    versions,
    setVersions,
    members,
    setMembers,
    priorities,
    setPriorities,
  };
};
