import React, { useEffect, useState } from 'react';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';
import { listAllProjectGroup } from '@/service/doc/project-group';
import { Select } from '@arco-design/web-react';

export const PERSONAL_VALUE = 'personal';

export function ProjectGroupSelect(
  props: SelectProps &
    React.RefAttributes<SelectHandle> & {
      personal?: boolean;
    }
) {
  const { personal = false, value = personal ? PERSONAL_VALUE : undefined } =
    props;

  const [options, setOptions] = useState([]);
  const [val, setVal] = useState(value);

  useEffect(() => {
    if (!value && personal) {
      setVal(PERSONAL_VALUE);
    }
    setVal(value);
  }, [personal, value]);

  useEffect(() => {
    listAllProjectGroup().then((groups) => {
      const ops = [];
      if (personal) {
        ops.push({
          key: PERSONAL_VALUE,
          label: '个人空间',
          value: PERSONAL_VALUE,
        });
      }
      ops.push(
        ...groups.map((group) => ({
          key: group.id,
          label: group.name,
          value: group.id,
        }))
      );
      setOptions(ops);
    });
  }, [personal]);

  return <Select options={options} {...props} value={val} />;
}

export default ProjectGroupSelect;
