import { useCallback, useState } from 'react';
import type { ScrumPriority, ScrumVersion } from '@/services/scrum/EntitiyType';
import type { QuietUser } from '@/services/system/EntityType';

export default () => {
  const [projectId, setProjectId] = useState<string>();
  const [versions, setVersions] = useState<ScrumVersion[]>([]);
  const [members, setMembers] = useState<Record<string, QuietUser>>({});
  const [priorities, updatePriorities] = useState<ScrumPriority[]>([]);
  const [selectedIterationId, setSelectedIterationId] = useState<string>();
  const [priorityColors, setPriorityColors] = useState<Record<string, string>>({});

  const setPriorities = useCallback((ps: ScrumPriority[]) => {
    updatePriorities(ps);
    if (ps) {
      const datum: Record<string, string> = {};
      ps.forEach((p) => {
        datum[p.id] = p.colorHex;
      });
      setPriorityColors(datum);
    }
  }, []);

  return {
    projectId,
    setProjectId,
    versions,
    setVersions,
    members,
    setMembers,
    priorities,
    setPriorities,
    selectedIterationId,
    setSelectedIterationId,
    priorityColors,
  };
};
