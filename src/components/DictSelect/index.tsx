import { Select, TreeSelect } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  RefTreeSelectType,
  TreeSelectDataType,
  TreeSelectProps,
} from '@arco-design/web-react/es/TreeSelect/interface';
import { QuietDict } from '@/service/system/type';
import { findEnabledDict } from '@/service/system/quiet-dict';
import {
  SelectHandle,
  SelectProps,
} from '@arco-design/web-react/es/Select/interface';

// env: 部署环境
// demand-type：需求类型
// task-type：任务类型
export type TypeKey = 'env' | 'demand-type' | 'task-type';

// quiet-system 系统服务
// quiet-doc 文档服务
// quiet-scrum 敏捷管理服务
export type ServiceId = 'quiet-system' | 'quiet-doc' | 'quiet-scrum';

const DictSelect = (
  props: TreeSelectProps & {
    typeId?: string;
    serviceId?: string | ServiceId;
    typeKey?: string | TypeKey;
    children?: React.ReactNode;
  } & React.RefAttributes<RefTreeSelectType> &
    SelectProps &
    React.RefAttributes<SelectHandle>
) => {
  const [dictData, setDictData] = useState([]);
  const [isTree, setIsTree] = useState<boolean>();

  useEffect(() => {
    const buildDictData = (data: QuietDict[]) => {
      const buildResult: TreeSelectDataType[] = _.clone(data);
      if (data) {
        for (let i = 0; i < data.length; i += 1) {
          buildResult[i].value = data[i].key;
          buildResult[i].title = data[i].name;
          buildResult[i].label = data[i].name;
          if (data[i].children && data[i].children.length > 0) {
            setIsTree(true);
            buildResult[i].children = buildDictData(data[i].children);
          }
        }
      }
      return buildResult;
    };
    if (props.typeId || (props.serviceId && props.typeKey)) {
      findEnabledDict(props.typeId, props.serviceId, props.typeKey).then(
        (resp) => {
          setDictData(buildDictData(resp));
        }
      );
    } else {
      setDictData([]);
    }
  }, [props.serviceId, props.typeId, props.typeKey]);

  return isTree ? (
    <TreeSelect
      showSearch
      placeholder={'请选择'}
      treeData={dictData}
      {...props}
    />
  ) : (
    <Select showSearch placeholder={'请选择'} options={dictData} {...props} />
  );
};

export default DictSelect;
