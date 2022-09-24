import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import React, { useEffect } from 'react';
import debounce from 'lodash/debounce';
import { Empty, Select, Spin } from '@arco-design/web-react';

const DebounceSelect = <
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  }
>(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      initOptions?: () => Promise<ValueType[]>;
      fetchOptions: (search: string) => Promise<ValueType[]>;
      debounceTimeout?: number;
    }
) => {
  const { fetchOptions, debounceTimeout = 500 } = props;

  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState<ValueType[]>([]);
  const fetchRef = React.useRef(0);

  useEffect(() => {
    if (props.initOptions) {
      props.initOptions().then((ops) => {
        if (ops) {
          setOptions(ops);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <Select
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={
        <div style={{ textAlign: 'center' }}>
          {fetching ? <Spin /> : <Empty />}
        </div>
      }
      options={options}
      onBlur={() => setOptions([])}
      {...props}
    />
  );
};

export default DebounceSelect;
