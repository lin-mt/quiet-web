import { useState } from 'react';
import type { ScrumPriority, ScrumVersion } from '@/services/scrum/EntitiyType';
import type { QuietUser } from '@/services/system/EntityType';

export default () => {
  const [projectId, setProjectId] = useState<string>();
  const [versions, setVersions] = useState<ScrumVersion[]>([]);
  const [members, setMembers] = useState<Record<string, QuietUser>>({});
  const [priorities, setPriorities] = useState<ScrumPriority[]>([]);

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
