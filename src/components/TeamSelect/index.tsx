import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { Select, Spin } from '@arco-design/web-react';
import debounce from 'lodash/debounce';
import { listTeams } from '@/service/system/quiet-team';

export function TeamSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      debounceTimeout?: number;
    }
) {
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const refFetchId = useRef(null);

  async function findByTeamName(name: string, teamIds?: string[]) {
    return listTeams({ team_name: name, ids: teamIds }).then((resp) => {
      return resp.map((team) => ({
        key: team.id,
        label: team.team_name,
        value: team.id,
      }));
    });
  }

  useEffect(() => {
    if (!props.value) {
      setOptions([]);
      return;
    }
    let temaIds;
    if (props.mode === 'multiple') {
      temaIds = props.value;
    } else {
      temaIds = [props.value];
    }
    let allIn = true;
    for (let i = 0; i < temaIds.length; i++) {
      if (options.findIndex((o) => o.value === temaIds[i]) === -1) {
        allIn = false;
        break;
      }
    }
    setOptions((prevState) => {
      return prevState.filter(
        (o) => temaIds.findIndex((id) => o.value === id) !== -1
      );
    });
    if (allIn) {
      return;
    }
    findByTeamName('', temaIds).then((res) => {
      setOptions(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.value)]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchTeam = useCallback(
    debounce((inputValue) => {
      refFetchId.current = Date.now();
      const fetchId = refFetchId.current;
      setFetching(true);
      listTeams({ team_name: inputValue }).then((resp) => {
        if (refFetchId.current === fetchId) {
          const respOptions = resp.map((team) => ({
            label: team.team_name,
            value: team.id,
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
      onSearch={debouncedFetchTeam}
      {...props}
    />
  );
}

export default TeamSelect;
