import type { ReactText } from 'react';
import React, { useEffect, useState } from 'react';
import { Tree, Modal } from 'antd';
import { treeRole } from '@/services/system/QuiteRole';
import type { DataNode } from 'antd/lib/tree';

type RoleTreeProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  multiple?: boolean;
  onSelect?: (keys: ReactText[]) => void;
};

const RoleTree: React.FC<RoleTreeProps> = (props) => {
  const { visible, onCancel, onOk, multiple, onSelect } = props;

  const [treeData, setTreeData] = useState<DataNode[] | undefined>([]);

  useEffect(() => {
    const buildRoleTreeNodes = (data: any) => {
      const buildResult = JSON.parse(JSON.stringify(data));
      if (data) {
        for (let i = 0; i < data.length; i += 1) {
          buildResult[i].key = data[i].id;
          buildResult[i].title = data[i].roleName;
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
    if (onSelect) {
      onSelect(keys);
    }
  }

  function handleOnCancel() {
    onCancel();
  }

  function handleOnOk() {
    onOk();
  }

  return (
    <Modal
      destroyOnClose
      title="角色信息"
      visible={visible}
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
