import React, { useEffect } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd/es/select';
import type { DictionaryType } from '@/types/Type';
import { useModel } from 'umi';
import { DICTIONARY } from '@/constant/system/ModelNames';
import type { QuietDictionary } from '@/services/system/EntityType';

export interface DictionarySelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  type: DictionaryType;
  allowClear?: boolean;
}

type OptionType = {
  key: string;
  label: string;
  value: string;
};

export function DictionarySelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ type, allowClear = false, ...props }: DictionarySelectProps) {
  const { getDictionariesByType } = useModel(DICTIONARY);
  const [options, setOptions] = React.useState<OptionType[]>([]);

  useEffect(() => {
    let isMounted = true;

    const buildOptions = (sources: QuietDictionary[]): OptionType[] => {
      const datumOptions: OptionType[] = [];
      sources.forEach((dictionary) => {
        datumOptions.push({
          key: dictionary.id,
          value: `${dictionary.type}.${dictionary.key}`,
          label: dictionary.label,
        });
      });
      return datumOptions;
    };
    getDictionariesByType(type).then((dictionaries) => {
      if (isMounted) {
        setOptions(buildOptions(dictionaries));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [getDictionariesByType, type]);

  return <Select<ValueType> allowClear={allowClear} options={options} {...props} />;
}
