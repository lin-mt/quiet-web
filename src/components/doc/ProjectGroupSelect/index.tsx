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
  function fetchOptions(name: string, groupIds?: string[]) {
    return listAllProjectGroup(name, groupIds).then((groups) => {
      return groups.map((group) => ({
        key: group.id,
        label: group.name,
        value: group.id,
      }));
    });
  }

  function getOptionsByValues(values: string[]) {
    return fetchOptions('', values);
  }

  function getOptionsByInputValue(inputValue: string) {
    return fetchOptions(inputValue);
  }

  return (
    <DebounceSelect
      getOptionsByValues={getOptionsByValues}
      getOptionsByInputValue={getOptionsByInputValue}
      {...props}
    />
  );
}

export default ProjectGroupSelect;
