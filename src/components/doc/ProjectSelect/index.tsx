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
  async function initOptions() {
    return await findByName('', [props.value]);
  }

  async function findByName(name: string, ids?: string[]) {
    return listProject(name, ids).then((projects) => {
      return projects.map((project) => ({
        key: project.id,
        label: project.name,
        value: project.id,
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

export default ProjectSelect;
