import { useState } from 'react';

export default () => {
  const [versions, setVersions] = useState<ScrumEntities.ScrumVersion[]>([]);

  return { versions, setVersions };
};
