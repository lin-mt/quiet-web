import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { Select, Spin } from '@arco-design/web-react';
import debounce from 'lodash/debounce';
import { listProjectGroup } from '@/service/scrum/project-group';

export const PERSONAL_SPACE_VALUE = 'personal-space';

export function ProjectGroupSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      value?: string;
      debounceTimeout?: number;
    }
) {
  const personalSpace = { label: '个人空间', value: PERSONAL_SPACE_VALUE };
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const refFetchId = useRef(null);

  async function findByName(name: string, id?: string) {
    return listProjectGroup(name, id ? [id] : null).then((resp) => {
      return [personalSpace].concat(
        ...resp.map((projectGroup) => ({
          label: projectGroup.name,
          value: projectGroup.id,
        }))
      );
    });
  }

  useEffect(() => {
    findByName(
      '',
      PERSONAL_SPACE_VALUE === props.value ? undefined : props.value
    ).then((res) => {
      setOptions(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchProjectGroup = useCallback(
    debounce((inputValue) => {
      refFetchId.current = Date.now();
      const fetchId = refFetchId.current;
      setFetching(true);
      listProjectGroup(inputValue).then((resp) => {
        if (refFetchId.current === fetchId) {
          const respOptions = [personalSpace].concat(
            ...resp.map((projectGroup) => ({
              label: projectGroup.name,
              value: projectGroup.id,
            }))
          );
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
      onSearch={debouncedFetchProjectGroup}
      {...props}
    />
  );
}

export default ProjectGroupSelect;
