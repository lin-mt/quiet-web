import type { ReactText } from 'react';
import React, { useEffect, useState } from 'react';
import { Tree, Modal } from 'antd';
import { treeDataDictionaryByType } from '@/services/system/QuietDataDictionary';
import type { DataNode } from 'antd/lib/tree';

type DataDictionaryTreeProps = {
  type?: string;
  visible: boolean;
  maskClosable?: boolean;
  closable?: boolean;
  onCancel: () => void;
  onOk: (keys?: ReactText[]) => void;
  multiple?: boolean;
  onSelect?: (keys: ReactText[]) => void;
  afterClose?: () => void;
};

const DataDictionaryTree: React.FC<DataDictionaryTreeProps> = (props) => {
  const {
    type,
    visible,
    maskClosable,
    closable,
    onCancel,
    onOk,
    multiple,
    onSelect,
    afterClose,
  } = props;

  const [treeData, setTreeData] = useState<DataNode[] | undefined>([]);
  const [selectedKeys, setSelectedKeys] = useState<ReactText[]>([]);

  useEffect(() => {
    const buildDataDictionaryTreeNodes = (data: any) => {
      const buildResult = JSON.parse(JSON.stringify(data));
      if (data) {
        for (let i = 0; i < data.length; i += 1) {
          buildResult[i].key = data[i].id;
          buildResult[i].title = data[i].value;
          if (data[i].children) {
            buildResult[i].children = buildDataDictionaryTreeNodes(data[i].children);
          } else {
            buildResult[i].isLeaf = true;
          }
        }
      }
      return buildResult;
    };
    treeDataDictionaryByType(type).then((resp) => {
      setTreeData(buildDataDictionaryTreeNodes(resp));
    });
  }, [type]);

  function handleOnSelect(keys: ReactText[]) {
    setSelectedKeys(keys);
    if (onSelect) {
      onSelect(keys);
    }
  }

  function handleOnCancel() {
    onCancel();
  }

  function handleOnOk() {
    onOk(selectedKeys);
  }

  return (
    <Modal
      destroyOnClose
      closable={closable}
      maskClosable={maskClosable}
      title="数据字典信息"
      visible={visible}
      afterClose={afterClose}
      onCancel={handleOnCancel}
      onOk={handleOnOk}
    >
      <Tree.DirectoryTree
        multiple={multiple}
        onSelect={handleOnSelect}
        treeData={treeData}
        blockNode
      />
    </Modal>
  );
};

export default DataDictionaryTree;
