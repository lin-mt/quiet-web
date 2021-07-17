import React from 'react';
import { Empty, Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';
import { multipleSelectTagRender } from '@/utils/RenderUtils';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

export function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 500, ...props }: DebounceSelectProps) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState<ValueType[]>([]);
  const fetchRef = React.useRef(0);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select<ValueType>
      showSearch
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      tagRender={multipleSelectTagRender}
      notFoundContent={<div style={{ textAlign: 'center' }}>{fetching ? <Spin /> : <Empty />}</div>}
      options={options}
      onBlur={() => setOptions([])}
      {...props}
    />
  );
}
