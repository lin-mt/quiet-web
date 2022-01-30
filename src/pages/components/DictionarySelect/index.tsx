import React from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd/es/select';
import type { DictionaryType } from '@/types/Type';
import { useModel } from 'umi';
import { DICTIONARY } from '@/constant/system/ModelNames';

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
  const { getDictionaryByType } = useModel(DICTIONARY);
  const [options, setOptions] = React.useState<OptionType[]>([]);

  function initOptions() {
    if (!options || options.length === 0) {
      getDictionaryByType(type)
        .then((resp) => {
          const datumOptions: OptionType[] = [];
          resp.forEach((dictionary) => {
            if (dictionary.id) {
              datumOptions.push({
                key: dictionary.id,
                value: `${dictionary.type}.${dictionary.key}`,
                label: dictionary.label,
              });
            }
          });
          return datumOptions;
        })
        .then((ops) => setOptions(ops));
    }
  }

  return (
    <Select<ValueType> allowClear={allowClear} onClick={initOptions} options={options} {...props} />
  );
}
