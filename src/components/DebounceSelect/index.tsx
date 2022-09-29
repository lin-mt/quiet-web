import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { Select, Spin } from '@arco-design/web-react';

const DebounceSelect = <
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  }
>(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      getOptionsByValues: (values: string[]) => Promise<ValueType[]>;
      getOptionsByInputValue: (search: string) => Promise<ValueType[]>;
      debounceTimeout?: number;
    }
) => {
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const refFetchId = useRef(null);

  useEffect(() => {
    if (!props.value) {
      setOptions([]);
      return;
    }
    let values;
    if (props.mode === 'multiple') {
      values = props.value;
    } else {
      values = [props.value];
    }
    let allIn = true;
    for (let i = 0; i < values.length; i++) {
      if (options.findIndex((o) => o.value === values[i]) === -1) {
        allIn = false;
        break;
      }
    }
    setOptions((prevState) => {
      return prevState.filter(
        (o) => values.findIndex((id) => o.value === id) !== -1
      );
    });
    if (allIn) {
      return;
    }
    props.getOptionsByValues(values).then((res) => {
      setOptions(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.value)]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce((inputValue) => {
      refFetchId.current = Date.now();
      const fetchId = refFetchId.current;
      setFetching(true);
      props.getOptionsByInputValue(inputValue).then((resp) => {
        if (refFetchId.current === fetchId) {
          setOptions(resp);
          setFetching(false);
        }
      });
    }, 500),
    []
  );

  return (
    <Select
      showSearch
      options={options}
      filterOption={false}
      onSearch={debouncedFetch}
      notFoundContent={
        fetching ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin style={{ margin: 12 }} />
          </div>
        ) : null
      }
      {...props}
    />
  );
};

export default DebounceSelect;
