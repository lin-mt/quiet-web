import { TreeSelect } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  RefTreeSelectType,
  TreeSelectDataType,
  TreeSelectProps,
} from '@arco-design/web-react/es/TreeSelect/interface';
import { QuietDict } from '@/service/system/type';
import { findEnabledDict } from '@/service/system/quiet-dict';

const RoleTreeSelect = (
  props: TreeSelectProps & {
    typeId?: string;
    children?: React.ReactNode;
  } & React.RefAttributes<RefTreeSelectType>
) => {
  const [dictTreeData, setDictTreeData] = useState<TreeSelectDataType[]>([]);

  useEffect(() => {
    const buildDictTreeData = (data: QuietDict[]) => {
      const buildResult: TreeSelectDataType[] = _.clone(data);
      if (data) {
        for (let i = 0; i < data.length; i += 1) {
          buildResult[i].value = data[i].key;
          buildResult[i].title = data[i].name;
          if (data[i].children) {
            buildResult[i].children = buildDictTreeData(data[i].children);
          }
        }
      }
      return buildResult;
    };
    if (props.typeId) {
      findEnabledDict(props.typeId).then((resp) => {
        setDictTreeData(buildDictTreeData(resp));
      });
    } else {
      setDictTreeData([]);
    }
  }, [props.typeId]);

  return (
    <TreeSelect
      showSearch={true}
      placeholder={'请选择'}
      treeData={dictTreeData}
      {...props}
    />
  );
};

export default RoleTreeSelect;
