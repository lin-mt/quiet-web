import React, {
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
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
import { DroppableId } from '@/pages/scrum/demand-planning/index';
import { Draggable, Droppable } from 'react-beautiful-dnd';

export type DemandPoolProps = {
  projectId: string;
  typeKey2Name: Record<string, string>;
  priorities: ScrumPriority[];
  priorityId2Color: Record<string, string>;
  afterDelete?: (id: string) => void;
  afterUpdate?: (demand: ScrumDemand) => void;
};

export type DemandPoolRefProps = {
  getDemandByDraggableId: (draggableId: string) => ScrumDemand | null;
  removeDemand: (index: number) => void;
  addDemand: (demand: ScrumDemand, index: number) => void;
  removeDemandById: (id: string) => void;
  updateDemand: (demand: ScrumDemand, index: number) => void;
};

// 必须大于 164
export const DemandContainerHeight = 830;

export default forwardRef(
  (
    props: PropsWithChildren<DemandPoolProps>,
    ref: ForwardedRef<DemandPoolRefProps>
  ) => {
    const defaultPagination = { page_size: 20, current: 1, desc: 'gmt_create' };
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

    function buildDraggableId(demandId: string): string {
      return DroppableId.DemandPool + demandId;
    }

    useImperativeHandle(ref, () => ({
      getDemandByDraggableId: (draggableId) => {
        let demand = null;
        demands.every((datum) => {
          if (buildDraggableId(datum.id) === draggableId) {
            demand = datum;
            return false;
          }
          return true;
        });
        return demand;
      },
      removeDemand: (index) => {
        const newDemands = Array.from(demands);
        newDemands.splice(index, 1);
        setDemands([]);
        setDemands(newDemands);
      },
      addDemand: (newDemand, index) => {
        const newDemands = Array.from(demands);
        newDemands.splice(index, 0, newDemand);
        setDemands([]);
        setDemands(newDemands);
      },
      removeDemandById: (id) => {
        const index = demands.findIndex((d) => d.id === id);
        if (index < 0) {
          return;
        }
        const newDemands = Array.from(demands);
        newDemands.splice(index, 1);
        setDemands([]);
        setDemands(newDemands);
      },
      updateDemand: (demand, index) => {
        const existIndex = demands.findIndex((d) => d.id === demand.id);
        const newDemands = Array.from(demands);
        if (existIndex < 0) {
          if (index < 0) {
            return;
          }
          newDemands.splice(index, 0, demand);
        } else {
          newDemands.splice(existIndex, 1, demand);
        }
        setDemands([]);
        setDemands(newDemands);
      },
    }));

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
          <Draggable
            draggableId={'scroll_loading'}
            index={demands.length}
            key={demands.length}
            isDragDisabled={true}
          >
            {(draggableProvider) => (
              <div
                ref={draggableProvider.innerRef}
                {...draggableProvider.draggableProps}
                {...draggableProvider.dragHandleProps}
              >
                <div
                  style={{
                    paddingTop: 5,
                    paddingBottom: 5,
                    marginRight: 17,
                  }}
                >
                  <Typography.Text type={'secondary'} style={{ fontSize: 12 }}>
                    没有更多需求了～
                  </Typography.Text>
                </div>
              </div>
            )}
          </Draggable>
        )
      );
    }, [demands.length, hasMoreDemand]);

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
        bodyStyle={{
          paddingTop: 10,
          paddingRight: 3,
          maxHeight: DemandContainerHeight,
        }}
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
          <Droppable droppableId={DroppableId.DemandPool}>
            {(droppableProvided) => (
              <div ref={droppableProvided.innerRef}>
                <List
                  dataSource={demands}
                  style={{ height: DemandContainerHeight }}
                  scrollLoading={scrollLoading}
                  className={styles['demand-pool-card']}
                  onReachBottom={loadMoreDemands}
                  render={(demand, index) => {
                    const isDragDisabled = !!demand.iteration_id;
                    return (
                      <Draggable
                        draggableId={buildDraggableId(demand.id)}
                        index={index}
                        key={index}
                        isDragDisabled={isDragDisabled}
                      >
                        {(draggableProvider) => (
                          <div
                            {...draggableProvider.draggableProps}
                            {...draggableProvider.dragHandleProps}
                            ref={draggableProvider.innerRef}
                          >
                            <div
                              style={{
                                marginBottom: 10,
                                marginRight: 17,
                              }}
                            >
                              <DemandCard
                                style={{
                                  backgroundColor: isDragDisabled
                                    ? 'rgb(var(--gray-2))'
                                    : undefined,
                                }}
                                demand={demand}
                                typeKey2Name={props.typeKey2Name}
                                priorityId2Color={props.priorityId2Color}
                                afterDelete={() => {
                                  reloadDemands();
                                  if (props.afterDelete) {
                                    props.afterDelete(demand.id);
                                  }
                                }}
                                afterUpdate={(demand) => {
                                  if (props.afterUpdate) {
                                    props.afterUpdate(demand);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  }}
                />
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        {props.projectId && (
          <DemandForm projectId={props.projectId} {...demandFormProps} />
        )}
      </Card>
    );
  }
);
