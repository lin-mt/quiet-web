import { TreeSelect } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  RefTreeSelectType,
  TreeSelectDataType,
  TreeSelectProps,
} from '@arco-design/web-react/es/TreeSelect/interface';
import { QuietDept } from '@/service/system/type';
import { treeDept } from '@/service/system/quiet-dept';

const DeptTreeSelect = (
  props: TreeSelectProps & {
    children?: React.ReactNode;
  } & React.RefAttributes<RefTreeSelectType>
) => {
  const [deptTreeData, setDeptTreeData] = useState<TreeSelectDataType[]>([]);

  useEffect(() => {
    const buildDeptTreeData = (data: QuietDept[]) => {
      const buildResult: TreeSelectDataType[] = _.clone(data);
      if (data) {
        for (let i = 0; i < data.length; i += 1) {
          buildResult[i].key = data[i].id;
          if (data[i].children) {
            buildResult[i].children = buildDeptTreeData(data[i].children);
          }
        }
      }
      return buildResult;
    };
    treeDept().then((resp) => {
      setDeptTreeData(buildDeptTreeData(resp));
    });
  }, []);

  return (
    <TreeSelect
      multiple={true}
      showSearch={true}
      allowClear={true}
      placeholder={'请选择部门'}
      treeData={deptTreeData}
      {...props}
    />
  );
};

export default DeptTreeSelect;
