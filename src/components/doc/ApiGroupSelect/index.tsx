import React from 'react';
import DebounceSelect from '@/components/DebounceSelect';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { listApiGroup } from '@/service/doc/api-group';

export function ProjectGroupSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      projectId: string;
      value?: string;
      debounceTimeout?: number;
    }
) {
  async function initOptions() {
    return await findByName('', [props.value]);
  }

  async function findByName(name: string, ids?: string[]) {
    return listApiGroup(props.projectId, name, ids, 9).then((groups) => {
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
