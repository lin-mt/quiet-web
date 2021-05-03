import { useCallback, useState } from 'react';
import type { QuietDictionary } from '@/services/system/EntityType';

export default () => {
  const [dictionaries] = useState<Record<string, QuietDictionary[]>>({});

  const addDictionaries = useCallback(
    (type: string, newDictionaries: QuietDictionary[]) => {
      if (!dictionaries[type]) {
        dictionaries[type] = newDictionaries;
      }
    },
    [dictionaries],
  );

  return { dictionaries, addDictionaries };
};
