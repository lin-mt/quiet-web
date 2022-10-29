import React from 'react';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import DebounceSelect from '@/components/DebounceSelect';
import { listProject } from '@/service/doc/project';

function ProjectSelect(
  props: SelectProps & React.RefAttributes<SelectHandle> & { value?: string }
) {
  function fetchOptions(name: string, ids?: string[]) {
    return listProject(name, ids).then((projects) => {
      return projects.map((project) => ({
        key: project.id,
        label: project.name,
        value: project.id,
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

export default ProjectSelect;
