import React, { useEffect, useState } from 'react';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { listProject } from '@/service/doc/project';
import { Select } from '@arco-design/web-react';

function ProjectSelect(
  props: SelectProps & React.RefAttributes<SelectHandle> & { groupId: string }
) {
  const { groupId } = props;

  const [options, setOptions] = useState([]);

  useEffect(() => {
    listProject(groupId).then((projects) => {
      setOptions(
        projects.map((project) => ({
          key: project.id,
          label: project.name,
          value: project.id,
        }))
      );
    });
  }, [groupId]);

  return <Select options={options} {...props} />;
}

export default ProjectSelect;
