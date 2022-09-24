import React from 'react';
import { listUsers } from '@/service/system/quiet-user';
import DebounceSelect from '@/components/DebounceSelect';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';

export function UserSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      debounceTimeout?: number;
    }
) {
  async function initOptions() {
    let userIds;
    if (!props.value) {
      return;
    }
    if (props.value instanceof Array) {
      userIds = props.value.map((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return val;
        }
        return val.value;
      });
    } else if (
      typeof props.value === 'string' ||
      typeof props.value === 'number'
    ) {
      userIds = [];
      userIds.push(props.value);
    } else {
      const userIds = [];
      userIds.push(props.value.value);
    }
    if (userIds && userIds.length > 0) {
      return await findUserByName('', userIds);
    }
  }

  async function findUserByName(name: string, userIds?: string[]) {
    return listUsers(name, userIds).then((resp) => {
      return resp.map((user) => ({
        key: user.id,
        label: user.full_name,
        value: user.id,
      }));
    });
  }

  return (
    <DebounceSelect
      initOptions={() => initOptions()}
      fetchOptions={findUserByName}
      {...props}
    />
  );
}

export default UserSelect;
