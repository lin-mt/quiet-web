import { useCallback, useState } from 'react';
import type { QuietDictionary } from '@/services/system/EntityType';
import type { DictionaryType } from '@/types/Type';
import { listByTypeForSelect } from '@/services/system/QuietDictionary';

export default () => {
  const [dictionaries] = useState<Record<string, QuietDictionary[]>>({});
  const [dictionaryLabels] = useState<Record<string, Record<string, string>>>({});

  const getDictionariesByType = useCallback(
    async (type: DictionaryType): Promise<QuietDictionary[]> => {
      if (!dictionaries[type] || dictionaries[type].length === 0) {
        dictionaries[type] = await listByTypeForSelect(type);
      }
      return dictionaries[type];
    },
    [dictionaries],
  );

  const buildDictionaryLabels = useCallback((quietDictionaries: QuietDictionary[]): Record<
    string,
    string
  > => {
    const datum: Record<string, string> = {};
    quietDictionaries.forEach((dictionary) => {
      if (dictionary.children) {
        const childrenLabels: Record<string, string> = buildDictionaryLabels(dictionary.children);
        Object.keys(childrenLabels).forEach((key) => {
          datum[key] = childrenLabels[key];
        });
      }
      datum[`${dictionary.type}.${dictionary.key}`] = dictionary.label;
    });
    return datum;
  }, []);

  const getDictionaryLabels = useCallback(
    async (type: DictionaryType): Promise<Record<string, string>> => {
      if (!dictionaryLabels[type]) {
        const quietDictionaries: QuietDictionary[] = await getDictionariesByType(type);
        dictionaryLabels[type] = await buildDictionaryLabels(quietDictionaries);
      }
      return dictionaryLabels[type];
    },
    [buildDictionaryLabels, dictionaryLabels, getDictionariesByType],
  );

  const initDictionaries = useCallback(
    (types: DictionaryType[]) => {
      types.forEach((type) => {
        getDictionaryLabels(type).then();
      });
    },
    [getDictionaryLabels],
  );

  return { getDictionariesByType, getDictionaryLabels, initDictionaries };
};
