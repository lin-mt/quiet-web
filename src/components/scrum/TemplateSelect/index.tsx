import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { Select, Spin } from '@arco-design/web-react';
import debounce from 'lodash/debounce';
import { listTemplate } from '@/service/scrum/template';

export function TemplateSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      value?: string;
      debounceTimeout?: number;
    }
) {
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const refFetchId = useRef(null);

  async function findByName(name: string, id?: string) {
    return listTemplate({ name, enabled: true, id, limit: 0 }).then((resp) => {
      return resp.map((template) => ({
        key: template.id,
        label: template.name,
        value: template.id,
      }));
    });
  }

  useEffect(() => {
    findByName('', props.value).then((res) => {
      setOptions(res);
    });
  }, [props.value]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchTemplate = useCallback(
    debounce((inputValue) => {
      refFetchId.current = Date.now();
      const fetchId = refFetchId.current;
      setFetching(true);
      listTemplate({ name: inputValue }).then((resp) => {
        if (refFetchId.current === fetchId) {
          const respOptions = resp.map((template) => ({
            label: template.name,
            value: template.id,
          }));
          setFetching(false);
          setOptions(respOptions);
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
      onSearch={debouncedFetchTemplate}
      {...props}
    />
  );
}

export default TemplateSelect;
