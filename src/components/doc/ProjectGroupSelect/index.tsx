import React from 'react';
import DebounceSelect from '@/components/DebounceSelect';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { listAllProjectGroup } from '@/service/doc/project-group';

export function ProjectGroupSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      value?: string;
      debounceTimeout?: number;
    }
) {
  async function initOptions() {
    return await findByName('', [props.value]);
  }

  async function findByName(name: string, groupIds?: string[]) {
    return listAllProjectGroup(name, groupIds).then((groups) => {
      return groups.map((group) => ({
        key: group.id,
        label: group.name,
        value: group.id,
      }));
    });
  }

  return (
    <DebounceSelect
      initOptions={() => initOptions()}
      fetchOptions={findByName}
      {...props}
    />
  );
}

export default ProjectGroupSelect;
