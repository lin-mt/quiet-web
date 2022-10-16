import React, { ReactNode, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Empty,
  Grid,
  List,
  Message,
  Select,
  Spin,
  Typography,
} from '@arco-design/web-react';
import { getQueryParams } from '@/utils/getUrlParams';
import ScrumPlanningSelect from '@/components/scrum/ScrumPlanningSelect';
import { IconPlus } from '@arco-design/web-react/icon';
import DemandForm from '@/components/scrum/DemandForm';
import { QuietFormProps } from '@/components/type';
import { ScrumDemand, ScrumPriority } from '@/service/scrum/type';
import { pageDemand, saveDemand } from '@/service/scrum/demand';
import DemandCard from '@/components/scrum/DemandCard';
import { getProject } from '@/service/scrum/project';
import { listPriority } from '@/service/scrum/priority';
import { findEnabledDict } from '@/service/system/quiet-dict';
import DemandFilter, {
  DemandFilterParams,
} from '@/pages/scrum/demand-planning/demand-filter';
import styles from './style/index.module.less';

const { Row, Col } = Grid;

function DemandPlanning() {
  const query = getQueryParams();
  const defaultPagination = { page_size: 8, current: 1 };
  const [projectId, setProjectId] = useState(query.projectId);
  const [versionId, setVersionId] = useState(query.versionId);
  const [iterationId, setIterationId] = useState(query.iterationId);
  const [iterations, setIterations] = useState([]);
  const [priorities, setPriorities] = useState<ScrumPriority[]>([]);
  const [hasMoreDemand, setHasMoreDemand] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const [scrollLoading, setScrollLoading] = useState<ReactNode>();
  const [priorityId2Color, setPriorityId2Color] = useState<
    Record<string, string>
  >({});
  const [demands, setDemands] = useState<ScrumDemand[]>([]);
  const [typeKey2Name, setTypeKey2Name] = useState<Record<string, string>>({});
  const [demandFormProps, setDemandFormProps] =
    useState<QuietFormProps<ScrumDemand>>();
  const [pageParams, setPageParams] = useState<
    DemandFilterParams & { page_size: number; current: number }
  >(defaultPagination);

  useEffect(() => {
    findEnabledDict(null, 'quiet-scrum', 'demand-type').then((resp) => {
      const key2Name: Record<string, string> = {};
      resp.forEach((p) => (key2Name[p.key] = p.name));
      setTypeKey2Name(key2Name);
    });
  }, []);

  useEffect(() => {
    setPageParams(defaultPagination);
    if (!projectId) {
      setPriorities([]);
      setDemands([]);
      setHasMoreDemand(undefined);
      return;
    }
    getProject(projectId).then((resp) => {
      listPriority(resp.template_id)
        .then((sps) => {
          const id2Color: Record<string, string> = {};
          sps.forEach((p) => (id2Color[p.id] = p.color_hex));
          setPriorityId2Color(id2Color);
          setPriorities(sps);
        })
        .then(() => {
          pageDemand({ ...defaultPagination, project_id: projectId }).then(
            (resp) => {
              setHasMoreDemand(!resp.last);
              setDemands(resp.content);
            }
          );
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      setDemands([]);
      return;
    }
    setLoading(true);
    pageDemand({ ...pageParams, project_id: projectId })
      .then((resp) => {
        setHasMoreDemand(!resp.last);
        if (pageParams.current === 1) {
          setDemands(resp.content);
        } else {
          setDemands((prevState) => prevState.concat(...resp.content));
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pageParams)]);

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

  function handleVersionChange(vId, is) {
    setVersionId(vId);
    setIterationId(undefined);
    setIterations(is?.map((i) => ({ value: i.id, label: i.name })));
  }

  function handleCreateDemand() {
    if (!projectId) {
      Message.warning('请选择规划项目～');
      return;
    }
    setDemandFormProps({
      visible: true,
      title: '创建需求',
      onOk: (values) => {
        return saveDemand(values).finally(() =>
          setDemandFormProps({ visible: false })
        );
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
    <Card>
      <ScrumPlanningSelect
        onProjectChange={(id) => setProjectId(id)}
        onVersionIdChange={handleVersionChange}
        initIterations={(is) => {
          setIterations(is?.map((i) => ({ value: i.id, label: i.name })));
        }}
      />
      {!projectId ? (
        <Empty description={'请选择规划项目'} />
      ) : (
        <Row gutter={15}>
          <Col span={12}>
            <Card
              bordered
              bodyStyle={{ paddingTop: 10, paddingRight: 7 }}
              title={CreateDemand}
              extra={
                <DemandFilter
                  loading={loading}
                  priorities={priorities}
                  onSearch={handleSearchDemands}
                />
              }
            >
              <List
                hoverable
                dataSource={demands}
                style={{ maxHeight: 630 }}
                scrollLoading={scrollLoading}
                className={styles['demand-pool-card']}
                onReachBottom={loadMoreDemands}
                render={(item, index) => {
                  return (
                    <div
                      style={{ marginBottom: 9, marginRight: 13 }}
                      key={index}
                    >
                      <DemandCard
                        demand={item}
                        type={typeKey2Name[item.type]}
                        priorityColor={priorityId2Color[item.priority_id]}
                      />
                    </div>
                  );
                }}
              />
            </Card>
          </Col>
          <Col span={12}>
            {!versionId ? (
              <Empty description={'请选择规划版本'} />
            ) : (
              <Card
                bordered
                hoverable
                title={'规划迭代'}
                extra={
                  <Select
                    value={iterationId}
                    options={iterations}
                    placeholder={'请选择迭代'}
                    style={{ width: 300 }}
                    onChange={(value) => setIterationId(value)}
                  />
                }
              >
                {!iterationId ? (
                  <Empty description={'请选择规划迭代'} />
                ) : (
                  <>加载迭代+需求信息</>
                )}
              </Card>
            )}
          </Col>
        </Row>
      )}

      {projectId && <DemandForm projectId={projectId} {...demandFormProps} />}
    </Card>
  );
}

export default DemandPlanning;
