import type { ReactText } from 'react';
import React, { useEffect, useState } from 'react';
import { Tree, Modal } from 'antd';
import { treeRole } from '@/services/system/QuietRole';
import type { DataNode } from 'antd/lib/tree';

type RoleTreeProps = {
  visible: boolean;
  maskClosable?: boolean;
  closable?: boolean;
  onCancel: () => void;
  onOk: (keys?: ReactText[]) => void;
  multiple?: boolean;
  onSelect?: (keys: ReactText[]) => void;
  afterClose?: () => void;
};

const RoleTree: React.FC<RoleTreeProps> = (props) => {
  const { visible, maskClosable, closable, onCancel, onOk, multiple, onSelect, afterClose } = props;

  const [treeData, setTreeData] = useState<DataNode[] | undefined>([]);
  const [selectedKeys, setSelectedKeys] = useState<ReactText[]>([]);

  useEffect(() => {
    const buildRoleTreeNodes = (data: any) => {
      const buildResult = JSON.parse(JSON.stringify(data));
      if (data) {
        for (let i = 0; i < data.length; i += 1) {
          buildResult[i].key = data[i].id;
          if (data[i].children) {
            buildResult[i].children = buildRoleTreeNodes(data[i].children);
          } else {
            buildResult[i].isLeaf = true;
          }
        }
      }
      return buildResult;
    };
    treeRole().then((resp) => {
      setTreeData(buildRoleTreeNodes(resp));
    });
  }, []);

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
      title="角色信息"
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

export default RoleTree;
