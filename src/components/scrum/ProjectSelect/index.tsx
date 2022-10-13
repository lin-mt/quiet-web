import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { Select, Spin } from '@arco-design/web-react';
import debounce from 'lodash/debounce';
import { listProject } from '@/service/scrum/project';

export function ProjectSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      value?: string;
      groupId?: string;
      debounceTimeout?: number;
    }
) {
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const refFetchId = useRef(null);

  async function findByName(name: string, id?: string) {
    return listProject(props.groupId, name, id).then((resp) => {
      return resp.map((project) => ({
        label: project.name,
        value: project.id,
      }));
    });
  }

  useEffect(() => {
    findByName('', props.value).then((res) => {
      setOptions(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchProject = useCallback(
    debounce((inputValue) => {
      refFetchId.current = Date.now();
      const fetchId = refFetchId.current;
      setFetching(true);
      listProject(props.groupId, inputValue).then((resp) => {
        if (refFetchId.current === fetchId) {
          const respOptions = resp.map((project) => ({
            label: project.name,
            value: project.id,
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
      onSearch={debouncedFetchProject}
      {...props}
    />
  );
}

export default ProjectSelect;
