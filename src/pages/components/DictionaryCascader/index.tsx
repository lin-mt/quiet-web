import React from 'react';
import type { CascaderProps } from 'antd';
import { Cascader, Empty, Spin } from 'antd';
import type { DictionaryType } from '@/types/Type';
import { useModel } from 'umi';
import { DICTIONARY } from '@/constant/system/ModelNames';
import type { QuietDictionary } from '@/services/system/EntityType';

export interface DictionaryCascaderProps extends Omit<CascaderProps, 'options' | 'children'> {
  type: DictionaryType;
  allowClear?: boolean;
}

type OptionType = {
  key: string;
  label: string;
  value: string;
  children?: OptionType[];
};

export function DictionaryCascader({
  type,
  allowClear = false,
  defaultValue,
  ...props
}: DictionaryCascaderProps) {
  const { getDictionaryByType } = useModel(DICTIONARY);
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<OptionType[]>([]);

  const buildOptions = (sources: QuietDictionary[]): OptionType[] => {
    const datumOptions: OptionType[] = [];
    sources.forEach((dictionary) => {
      datumOptions.push({
        key: dictionary.id,
        value: `${dictionary.type}.${dictionary.key}`,
        label: dictionary.label,
        children: dictionary.children ? buildOptions(dictionary.children) : undefined,
      });
    });
    return datumOptions;
  };

  function loadData() {
    setLoading(true);
    getDictionaryByType(type)
      .then((resp) => {
        return buildOptions(resp);
      })
      .then((ops) => setOptions(ops));
  }

  return (
    <Cascader
      allowClear={allowClear}
      loadData={loadData}
      notFoundContent={<div style={{ textAlign: 'center' }}>{loading ? <Spin /> : <Empty />}</div>}
      options={options}
      {...props}
    />
  );
}
