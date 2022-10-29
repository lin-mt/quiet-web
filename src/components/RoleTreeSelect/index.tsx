import { TreeSelect } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { treeRole } from '@/service/system/quiet-role';
import {
  RefTreeSelectType,
  TreeSelectDataType,
  TreeSelectProps,
} from '@arco-design/web-react/es/TreeSelect/interface';
import { QuietRole } from '@/service/system/type';

const RoleTreeSelect = (
  props: TreeSelectProps & {
    children?: React.ReactNode;
  } & React.RefAttributes<RefTreeSelectType>
) => {
  const [roleTreeData, setRoleTreeData] = useState<TreeSelectDataType[]>([]);

  useEffect(() => {
    const buildRoleTreeData = (data: QuietRole[]) => {
      const buildResult: TreeSelectDataType[] = _.clone(data);
      if (data) {
        for (let i = 0; i < data.length; i += 1) {
          buildResult[i].key = data[i].id;
          if (data[i].children) {
            buildResult[i].children = buildRoleTreeData(data[i].children);
          }
        }
      }
      return buildResult;
    };
    treeRole().then((resp) => {
      setRoleTreeData(buildRoleTreeData(resp));
    });
  }, []);

  return (
    <TreeSelect
      treeData={roleTreeData}
      fieldNames={{ key: 'id', title: 'role_cn_name' }}
      {...props}
    />
  );
};

export default RoleTreeSelect;
