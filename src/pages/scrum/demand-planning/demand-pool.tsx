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

export type DemandPoolProps = {
  projectId: string;
  typeKey2Name: Record<string, string>;
  priorities: ScrumPriority[];
  priorityId2Color: Record<string, string>;
};

function DemandPool(props: DemandPoolProps) {
  const defaultPagination = { page_size: 8, current: 1, desc: 'gmt_create' };
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

  useEffect(() => {
    setPageParams(defaultPagination);
    if (!props.projectId) {
      setDemands([]);
      setHasMoreDemand(undefined);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.projectId]);

  useEffect(() => {
    if (!props.projectId) {
      setDemands([]);
      return;
    }
    pageDemand({ ...pageParams, project_id: props.projectId })
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
    if (!props.projectId) {
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
          priorities={props.priorities}
          onSearch={handleSearchDemands}
        />
      }
    >
      {Object.keys(props.priorityId2Color).length > 0 && (
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
                  typeKey2Name={props.typeKey2Name}
                  priorityId2Color={props.priorityId2Color}
                  afterDelete={() => reloadDemands()}
                />
              </div>
            );
          }}
        />
      )}
      {props.projectId && (
        <DemandForm projectId={props.projectId} {...demandFormProps} />
      )}
    </Card>
  );
}

export default DemandPool;
