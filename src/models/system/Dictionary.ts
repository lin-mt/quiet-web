import { useState } from 'react';
import type { QuietDictionary } from '@/services/system/EntityType';
import type { DictionaryType } from '@/types/Type';
import { listByTypeForSelect } from '@/services/system/QuietDictionary';

export default () => {
  const [dictionaries, setDictionaries] = useState<Record<string, QuietDictionary[]>>({});
  const [dictionaryLabels, setDictionarylabels] = useState<Record<string, Record<string, string>>>(
    {},
  );

  const getDictionaryByType = async (type: DictionaryType): Promise<QuietDictionary[]> => {
    let dicArr: QuietDictionary[] = dictionaries[type];
    if (!dicArr || dicArr.length === 0) {
      dicArr = await listByTypeForSelect(type);
      setDictionaries((prevState) => {
        return { ...prevState, [type]: dicArr };
      });
    }
    return dicArr;
  };

  const buildLabels = (quietDictionaries: QuietDictionary[]): Record<string, string> => {
    const datum: Record<string, string> = {};
    quietDictionaries.forEach((dictionary) => {
      if (dictionary.children) {
        const childrenLabels: Record<string, string> = buildLabels(dictionary.children);
        Object.keys(childrenLabels).forEach((key) => {
          datum[key] = childrenLabels[key];
        });
      }
      datum[`${dictionary.type}.${dictionary.key}`] = dictionary.label;
    });
    return datum;
  };

  const getDictionaryLabelByType = async (
    type: DictionaryType,
  ): Promise<Record<string, string>> => {
    let dicLabels: Record<string, string> = dictionaryLabels[type];
    if (!dicLabels) {
      dicLabels = buildLabels(await getDictionaryByType(type));
      setDictionarylabels((prevState) => {
        return { ...prevState, [type]: dicLabels };
      });
    }
    return dicLabels;
  };

  return {
    getDictionaryByType,
    getDictionaryLabelByType,
  };
};
