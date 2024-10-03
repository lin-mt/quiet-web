import type { GetProp, TransferProps, TreeDataNode } from 'antd';
import { Transfer, Tree, theme } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];

interface TreeTransferProps {
  dataSource: TreeDataNode[];
  targetKeys: string[];
  onChange: TransferProps['onChange'];
}

const generateTree = (treeNodes: TreeDataNode[] = [], checkedKeys: string[] = []): TreeDataNode[] =>
  treeNodes?.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key as string),
    children: generateTree(children, checkedKeys),
  }));

const filterTree = (data: TreeDataNode[], targetKeys: string[]): TreeDataNode[] => {
  function isIdIncluded(item: TreeDataNode): boolean {
    if (targetKeys.includes(item.key.toString())) {
      return true;
    }
    if (item.children) {
      return item.children.some(isIdIncluded);
    }
    return false;
  }
  return data.reduce((acc: TreeDataNode[], item) => {
    const included = isIdIncluded(item);
    if (included) {
      const newItem = _.cloneDeep(item);
      if (!targetKeys.includes(item.key.toString())) {
        newItem.disabled = true;
      }
      if (item.children) {
        newItem.children = filterTree(newItem.children as TreeDataNode[], targetKeys);
      }
      acc.push(newItem);
    }
    return acc;
  }, []);
};

function getAllKeys(data: TreeDataNode[]): string[] {
  let keys: string[] = [];
  for (const item of data) {
    keys.push(item.key.toString());
    if (item.children) {
      keys = keys.concat(getAllKeys(item.children));
    }
  }
  return keys;
}

const TreeTransfer: React.FC<TreeTransferProps> = ({ dataSource, targetKeys, ...restProps }) => {
  const { token } = theme.useToken();
  const [rightExpandKeys, setRightExpandKeys] = useState<string[]>([]);
  const [rightDataSource, setRightDataSource] = useState<TreeDataNode[]>([]);

  const transferDataSource: TransferItem[] = [];
  function flatten(list: TreeDataNode[] = []) {
    list?.forEach((item) => {
      transferDataSource.push(item as TransferItem);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  useEffect(() => {
    const tmp = filterTree(dataSource, targetKeys);
    setRightDataSource(tmp);
    setRightExpandKeys(getAllKeys(tmp));
  }, [dataSource, targetKeys]);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      showSelectAll={false}
    >
      {({ direction, onItemSelectAll, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          const treeData = generateTree(dataSource, targetKeys);
          return (
            <div style={{ padding: token.paddingXS }}>
              <Tree
                blockNode
                checkable
                defaultExpandAll
                selectable={false}
                checkedKeys={checkedKeys}
                treeData={treeData}
                onCheck={(keys, { checked }) => {
                  const tempKeys = keys as React.Key[];
                  let selectedKeys: string[] = [];
                  for (let index = 0; index < tempKeys.length; index++) {
                    selectedKeys.push(tempKeys[index].toString());
                  }
                  if (checked) {
                    onItemSelectAll(selectedKeys, true);
                  } else {
                    onItemSelectAll(
                      checkedKeys.filter((item) => !selectedKeys.includes(item.toString())),
                      false,
                    );
                  }
                }}
              />
            </div>
          );
        }
        if (direction === 'right') {
          return (
            <div style={{ padding: token.paddingXS }}>
              <Tree
                blockNode
                checkable
                defaultExpandAll
                selectable={false}
                checkedKeys={selectedKeys}
                expandedKeys={rightExpandKeys}
                onExpand={(_, { node, expanded }) => {
                  if (expanded) {
                    setRightExpandKeys([...rightExpandKeys, node.key.toString()]);
                  } else {
                    setRightExpandKeys(
                      rightExpandKeys.filter((item) => item !== node.key.toString()),
                    );
                  }
                }}
                treeData={rightDataSource}
                onCheck={(keys, { checked }) => {
                  const tempKeys = keys as React.Key[];
                  let selectedKeys: string[] = [];
                  for (let index = 0; index < tempKeys.length; index++) {
                    selectedKeys.push(tempKeys[index].toString());
                  }
                  if (checked) {
                    onItemSelectAll(selectedKeys, true);
                  } else {
                    onItemSelectAll(
                      selectedKeys.filter((item) => !selectedKeys.includes(item)),
                      false,
                    );
                  }
                }}
              />
            </div>
          );
        }
      }}
    </Transfer>
  );
};

export default TreeTransfer;
