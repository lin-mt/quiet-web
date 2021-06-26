import React, { useEffect } from 'react';
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
  const { getDictionariesByType } = useModel(DICTIONARY);
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<OptionType[]>([]);

  useEffect(() => {
    setLoading(true);
    let isMounted = true;

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

    getDictionariesByType(type).then((dictionaries) => {
      if (isMounted) {
        setOptions(buildOptions(dictionaries));
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [getDictionariesByType, type]);

  return (
    <Cascader
      allowClear={allowClear}
      notFoundContent={<div style={{ textAlign: 'center' }}>{loading ? <Spin /> : <Empty />}</div>}
      options={options}
      {...props}
    />
  );
}
