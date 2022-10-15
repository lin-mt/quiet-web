import React, { useEffect, useState } from 'react';
import { SelectHandle } from '@arco-design/web-react/es/Select/interface';
import { Spin, TreeSelect } from '@arco-design/web-react';
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
      debounceTimeout?: number;
    }
) {
  const [fetching, setFetching] = useState(false);
  const [treeData, setTreeData] = useState([]);

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
    const vsClone: ScrumVersion[] = _.cloneDeep(vs);
    const isClone: ScrumIteration[] = [];
    vsClone.forEach((vs) => {
      vs.type = PlanningType.VERSION;
      const iChildren = [];
      if (vId2It && vId2It[vs.id]) {
        vId2It[vs.id].forEach((i) => {
          const iClone = _.clone(i);
          iClone.type = PlanningType.ITERATION;
          iChildren.push(iClone);
        });
      }
      vs.children = buildTreeData(vs.children, vId2It);
      vs.children.push(...iChildren);
    });
    return [].concat(...vsClone, ...isClone);
  };

  useEffect(() => {
    if (!props.projectId) {
      return;
    }
    setFetching(true);
    treeVersion(props.projectId)
      .then((vs) => {
        const versionIds = getIds(vs);
        listIteration(versionIds).then((its) => {
          const vId2It: Record<string, ScrumIteration[]> = {};
          if (its && its.length > 0) {
            its.forEach((it) => {
              if (!vId2It[it.version_id]) {
                vId2It[it.version_id] = [];
              }
              vId2It[it.version_id].push(it);
            });
          }
          setTreeData(buildTreeData(vs, vId2It));
        });
      })
      .finally(() => setFetching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.projectId]);

  return (
    <TreeSelect
      showSearch
      treeData={treeData}
      notFoundContent={
        fetching ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin style={{ margin: 12 }} />
          </div>
        ) : null
      }
      {...props}
    />
  );
}

export default VersionSelect;
