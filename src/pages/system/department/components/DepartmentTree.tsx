import React, { ReactText, useEffect, useState } from 'react';
import { Tree, Modal } from 'antd';
import { treeDepartment } from '@/services/system/QuiteDepartment';

interface DepartmentTree {
  visible: boolean,
  onCancel: () => void;
  onOk: () => void;
  multiple?: boolean;
  onSelect?: (keys: ReactText[]) => void;
}

const DepartmentTree: React.FC<DepartmentTree> = (props) => {
  const { visible, onCancel, onOk, multiple, onSelect } = props;

  const [treeData, setTreeData] = useState<import('antd/lib/tree').DataNode[] | undefined>([]);

  useEffect(() => {
    treeDepartment().then(resp => {
      setTreeData(buildDepartmentTreeNodes(resp));
    });
  }, []);

  function buildDepartmentTreeNodes(data: any) {
    const buildResult = JSON.parse(JSON.stringify(data));
    if (data) {
      for (let i = 0; i < data.length; i += 1) {
        buildResult[i].key = data[i].id;
        buildResult[i].title = data[i].departmentName;
        if (data[i].children) {
          buildResult[i].children = buildDepartmentTreeNodes(data[i].children);
        } else {
          buildResult[i].isLeaf = true;
        }
      }
    }
    return buildResult;
  }

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
      title='部门信息'
      visible={visible}
      onCancel={handleOnCancel}
      onOk={handleOnOk}
    >
      <Tree.DirectoryTree
        multiple={multiple}
        onSelect={handleOnSelect}
        treeData={treeData}
        blockNode />
    </Modal>
  );
};

export default DepartmentTree;