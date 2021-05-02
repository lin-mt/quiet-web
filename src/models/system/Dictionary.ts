import { useCallback, useState } from 'react';

export default () => {
  const [dictionaries] = useState<Record<string, SystemEntities.QuietDictionary[]>>({});

  const addDictionaries = useCallback(
    (type: string, newDictionaries: SystemEntities.QuietDictionary[]) => {
      if (!dictionaries[type]) {
        dictionaries[type] = newDictionaries;
      }
    },
    [dictionaries],
  );

  return { dictionaries, addDictionaries };
};
