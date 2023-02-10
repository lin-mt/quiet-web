import React, { useEffect, useState } from 'react';
import { SelectHandle } from '@arco-design/web-react/es/Select/interface';
import { Divider, Space, Tag, TreeSelect } from '@arco-design/web-react';
import { treeVersion } from '@/service/scrum/version';
import { listIteration } from '@/service/scrum/iteration';
import {
  PlanningType,
  ScrumIteration,
  ScrumVersion,
} from '@/service/scrum/type';
import _ from 'lodash';
import { TreeSelectProps } from '@arco-design/web-react/es/TreeSelect/interface';

export function VersionSelect(
  props: TreeSelectProps &
    React.RefAttributes<SelectHandle> & {
      projectId: string;
      value?: string;
      versionSelectable?: boolean;
      iterationSelectable?: boolean;
      iterationAsChildren?: boolean;
      iterationEndSelectable?: boolean;
      disableIds?: string[];
      handleIterationsChange?: (iterations: ScrumIteration[]) => void;
    }
) {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const {
    versionSelectable = true,
    iterationSelectable = true,
    iterationEndSelectable = false,
  } = props;
  const getIds = (vs: ScrumVersion[]) => {
    const ids: string[] = [];
    if (vs && vs.length > 0) {
      vs.forEach((v) => {
        ids.push(v.id);
        if (v.children) {
          ids.push(...getIds(v.children));
        }
      });
    }
    return ids;
  };

  const buildTreeData = (
    vs: ScrumVersion[],
    vId2It: Record<string, ScrumIteration[]>
  ) => {
    let vsClone: ScrumVersion[] = _.cloneDeep(vs);
    if (!vsClone) {
      vsClone = [];
    }
    const isClone: ScrumIteration[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vsClone.forEach((vs: any) => {
      vs.type = PlanningType.VERSION;
      vs.key = vs.id;
      if (!versionSelectable) {
        vs.selectable = false;
      }
      if (props.disableIds?.indexOf(vs.id) > -1) {
        vs.selectable = false;
      }
      let vTagColor;
      if (!vs.start_time) {
        vTagColor = 'arcoblue';
      } else if (!vs.end_time) {
        vTagColor = 'green';
      } else {
        vTagColor = 'purple';
      }
      vs.title = (
        <Space>
          {props.iterationAsChildren && (
            <Tag color={vTagColor} size={'small'}>
              版本
            </Tag>
          )}
          {vs.name}
        </Space>
      );
      const iChildren = [];
      if (vId2It && vId2It[vs.id]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vId2It[vs.id].forEach((i: any) => {
          const iClone = _.clone(i);
          iClone.type = PlanningType.ITERATION;
          iClone.key = i.id;
          if (!iterationSelectable) {
            iClone.selectable = false;
          }
          if (props.disableIds?.indexOf(iClone.id) > -1) {
            iClone.selectable = false;
          }
          let tagColor;
          if (!iClone.start_time) {
            tagColor = 'arcoblue';
          } else if (!iClone.end_time) {
            tagColor = 'green';
          } else {
            tagColor = 'purple';
          }
          iClone.title = (
            <Space>
              <Tag color={tagColor} size={'small'}>
                迭代
              </Tag>
              {i.name}
            </Space>
          );
          iChildren.push(iClone);
        });
      }
      if (vs.id === props.value) {
        if (props.handleIterationsChange) {
          props.handleIterationsChange(iChildren);
        }
      }
      vs.iterations = iChildren;
      vs.children = buildTreeData(vs.children, vId2It);
      if (props.iterationAsChildren) {
        vs.children.unshift(...iChildren);
      }
    });
    return [].concat(...vsClone, ...isClone);
  };

  useEffect(() => {
    if (!props.projectId) {
      return;
    }
    setLoading(true);
    treeVersion(props.projectId)
      .then((vs) => {
        const versionIds = getIds(vs);
        listIteration(versionIds).then((its) => {
          const vId2It: Record<string, ScrumIteration[]> = {};
          if (its && its.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            its.forEach((it: any) => {
              if (!iterationEndSelectable && it.end_time) {
                it.selectable = false;
              }
              if (!vId2It[it.version_id]) {
                vId2It[it.version_id] = [];
              }
              vId2It[it.version_id].push(it);
            });
          }
          setTreeData(buildTreeData(vs, vId2It));
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.projectId]);

  function filterTreeNode(inputText, node) {
    return node.props.name.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  }

  return (
    <TreeSelect
      showSearch
      loading={loading}
      treeData={treeData}
      filterTreeNode={filterTreeNode}
      dropdownRender={(menu) => (
        <>
          {props.iterationAsChildren && (
            <>
              <Space
                size={0}
                style={{ padding: '5px 5px', float: 'right' }}
                split={<Divider type="vertical" />}
              >
                <div style={{ fontSize: 12, color: 'var(--color-text-2)' }}>
                  迭代状态
                </div>
                <Tag color={'arcoblue'} size={'small'}>
                  未开始
                </Tag>
                <Tag color={'green'} size={'small'}>
                  进行中
                </Tag>
                <Tag color={'purple'} size={'small'}>
                  已结束
                </Tag>
              </Space>
              <Divider style={{ margin: 0 }} />
            </>
          )}
          {menu}
        </>
      )}
      {...props}
    />
  );
}

export default VersionSelect;
