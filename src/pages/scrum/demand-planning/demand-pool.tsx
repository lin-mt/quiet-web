import React, { ReactNode, useEffect, useState } from 'react';
import DemandFilter, {
  DemandFilterParams,
} from '@/pages/scrum/demand-planning/demand-filter';
import {
  Button,
  Card,
  List,
  Message,
  Spin,
  Typography,
} from '@arco-design/web-react';
import styles from '@/pages/scrum/demand-planning/style/index.module.less';
import DemandCard from '@/components/scrum/DemandCard';
import { IconPlus } from '@arco-design/web-react/icon';
import { ScrumDemand, ScrumPriority } from '@/service/scrum/type';
import { pageDemand, saveDemand } from '@/service/scrum/demand';
import DemandForm from '@/components/scrum/DemandForm';
import { QuietFormProps } from '@/components/type';
import { findEnabledDict } from '@/service/system/quiet-dict';
import { getProject } from '@/service/scrum/project';
import { listPriority } from '@/service/scrum/priority';

export type DemandPoolProps = {
  projectId: string;
};

function DemandPool(props: DemandPoolProps) {
  const defaultPagination = { page_size: 8, current: 1, desc: 'gmt_create' };
  const [projectId, setProjectId] = useState(props.projectId);
  const [priorities, setPriorities] = useState<ScrumPriority[]>([]);
  const [priorityId2Color, setPriorityId2Color] = useState<
    Record<string, string>
  >({});
  const [demands, setDemands] = useState<ScrumDemand[]>([]);
  const [hasMoreDemand, setHasMoreDemand] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const [demandFormProps, setDemandFormProps] =
    useState<QuietFormProps<ScrumDemand>>();
  const [pageParams, setPageParams] = useState<
    DemandFilterParams & {
      page_size: number;
      current: number;
      version?: number;
    }
  >(defaultPagination);
  const [scrollLoading, setScrollLoading] = useState<ReactNode>();
  const [typeKey2Name, setTypeKey2Name] = useState<Record<string, string>>({});

  useEffect(() => {
    findEnabledDict(null, 'quiet-scrum', 'demand-type').then((resp) => {
      const key2Name: Record<string, string> = {};
      resp.forEach((p) => (key2Name[p.key] = p.name));
      setTypeKey2Name(key2Name);
    });
  }, []);

  useEffect(() => {
    setProjectId(props.projectId);
  }, [props.projectId]);

  useEffect(() => {
    setPageParams(defaultPagination);
    setProjectId(projectId);
    if (!projectId) {
      setPriorities([]);
      setDemands([]);
      setHasMoreDemand(undefined);
      return;
    }
    getProject(projectId).then((resp) => {
      listPriority(resp.template_id).then((sps) => {
        const id2Color: Record<string, string> = {};
        sps.forEach((p) => (id2Color[p.id] = p.color_hex));
        setPriorityId2Color(id2Color);
        setPriorities(sps);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      setDemands([]);
      return;
    }
    pageDemand({ ...pageParams, project_id: projectId })
      .then((resp) => {
        setHasMoreDemand(!resp.last);
        if (pageParams.current === 1) {
          setDemands([]);
          setDemands(resp.content);
        } else {
          setDemands((prevState) => prevState.concat(...resp.content));
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pageParams)]);

  function reloadDemands() {
    let nextVersion = 0;
    while (nextVersion === pageParams.version) {
      nextVersion = Math.floor(Math.random() * 10000);
    }
    setPageParams({ ...defaultPagination, version: nextVersion });
  }

  useEffect(() => {
    if (typeof hasMoreDemand === 'undefined') {
      setScrollLoading(undefined);
      return;
    }
    setScrollLoading(
      hasMoreDemand ? (
        <Spin loading={true} />
      ) : (
        <Typography.Text type={'secondary'} style={{ fontSize: 12 }}>
          没有更多需求了～
        </Typography.Text>
      )
    );
  }, [hasMoreDemand]);

  function handleCreateDemand() {
    if (!projectId) {
      Message.warning('请选择规划项目～');
      return;
    }
    setDemandFormProps({
      visible: true,
      title: '创建需求',
      onOk: (values) => {
        return saveDemand(values).then(() => {
          setDemandFormProps({ visible: false });
          reloadDemands();
        });
      },
      onCancel: () => setDemandFormProps({ visible: false }),
    });
  }

  const CreateDemand = (
    <Button type={'text'} icon={<IconPlus />} onClick={handleCreateDemand}>
      创建需求
    </Button>
  );

  function handleSearchDemands(params) {
    setHasMoreDemand(undefined);
    setPageParams({ ...defaultPagination, ...params });
  }

  function loadMoreDemands() {
    if (hasMoreDemand) {
      setPageParams((prevState) => ({
        ...prevState,
        current: prevState.current + 1,
      }));
    }
  }

  return (
    <Card
      bordered
      bodyStyle={{ paddingTop: 10, paddingRight: 3 }}
      title={CreateDemand}
      extra={
        <DemandFilter
          loading={loading}
          priorities={priorities}
          onSearch={handleSearchDemands}
        />
      }
    >
      {priorities?.length > 0 && (
        <List
          hoverable
          dataSource={demands}
          style={{ maxHeight: 630 }}
          scrollLoading={scrollLoading}
          className={styles['demand-pool-card']}
          onReachBottom={loadMoreDemands}
          render={(item, index) => {
            return (
              <div style={{ marginBottom: 9, marginRight: 17 }} key={index}>
                <DemandCard
                  demand={item}
                  typeKey2Name={typeKey2Name}
                  priorityId2Color={priorityId2Color}
                  afterDelete={() => reloadDemands()}
                />
              </div>
            );
          }}
        />
      )}
      {projectId && <DemandForm projectId={projectId} {...demandFormProps} />}
    </Card>
  );
}

export default DemandPool;
