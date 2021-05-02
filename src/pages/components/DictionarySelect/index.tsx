import React, { useEffect } from 'react';
import { Empty, Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import type { DictionaryType } from '@/types/Type';
import { useModel } from 'umi';
import { DICTIONARY } from '@/constant/system/Modelnames';
import { listByTypeForSelect } from '@/services/system/QuietDictionary';

export interface DictionarySelectProps extends Omit<SelectProps<any>, 'options' | 'children'> {
  type: DictionaryType;
  allowClear?: boolean;
}

type OptionType = {
  key: string;
  label: string;
  value: string;
};

export function DictionarySelect({ type, allowClear = false, ...props }: DictionarySelectProps) {
  const { dictionaries, addDictionaries } = useModel(DICTIONARY);
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<OptionType[]>([]);

  useEffect(() => {
    setLoading(true);
    let isMounted = true;

    const buildOptions = (sources: SystemEntities.QuietDictionary[]): OptionType[] => {
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
    if (dictionaries[type]) {
      setOptions(buildOptions(dictionaries[type]));
      setLoading(false);
    } else {
      listByTypeForSelect(type).then((resp) => {
        if (isMounted) {
          setOptions(buildOptions(resp));
          setLoading(false);
          addDictionaries(type, resp);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [addDictionaries, dictionaries, type]);

  return (
    <Select
      allowClear={allowClear}
      notFoundContent={<div style={{ textAlign: 'center' }}>{loading ? <Spin /> : <Empty />}</div>}
      options={options}
      {...props}
    />
  );
}
