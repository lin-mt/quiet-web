import React, { useCallback, useEffect, useRef, useState } from 'react';
import { listUsers } from '@/service/system/quiet-user';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { Select, Spin } from '@arco-design/web-react';
import debounce from 'lodash/debounce';

export function UserSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      debounceTimeout?: number;
    }
) {
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const refFetchId = useRef(null);

  async function findUserByName(name: string, userIds?: string[]) {
    return listUsers(name, userIds).then((resp) => {
      return resp.map((user) => ({
        key: user.id,
        label: user.full_name,
        value: user.id,
      }));
    });
  }

  useEffect(() => {
    if (!props.value) {
      setOptions([]);
      return;
    }
    let userIds;
    if (props.mode === 'multiple') {
      userIds = props.value;
    } else {
      userIds = [props.value];
    }
    let allIn = true;
    for (let i = 0; i < userIds.length; i++) {
      if (options.findIndex((o) => o.value === userIds[i]) === -1) {
        allIn = false;
        break;
      }
    }
    setOptions((prevState) => {
      return prevState.filter(
        (o) => userIds.findIndex((id) => o.value === id) !== -1
      );
    });
    if (allIn) {
      return;
    }
    findUserByName('', userIds).then((res) => {
      setOptions(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.value)]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchUser = useCallback(
    debounce((inputValue) => {
      refFetchId.current = Date.now();
      const fetchId = refFetchId.current;
      setFetching(true);
      listUsers(inputValue).then((resp) => {
        if (refFetchId.current === fetchId) {
          const respOptions = resp.map((user) => ({
            label: user.full_name,
            value: user.id,
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
      onSearch={debouncedFetchUser}
      {...props}
    />
  );
}

export default UserSelect;
