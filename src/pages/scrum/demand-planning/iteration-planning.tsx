import React, {
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { ScrumDemand } from '@/service/scrum/type';
import { getIteration } from '@/service/scrum/iteration';
import {
  Button,
  Card,
  Descriptions,
  Empty,
  List,
  Message,
  Select,
  Space,
  Typography,
} from '@arco-design/web-react';
import styles from '@/pages/scrum/demand-planning/style/index.module.less';
import DemandCard from '@/components/scrum/DemandCard';
import { listDemand } from '@/service/scrum/demand';
import { DroppableId } from '@/pages/scrum/demand-planning/index';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { DemandContainerHeight } from '@/pages/scrum/demand-planning/demand-pool';
import { IconSend } from '@arco-design/web-react/icon';
import NProgress from 'nprogress';
import { useHistory } from 'react-router';

export type IterationPlanningProps = {
  iterationId: string;
  iterations: (
    | string
    | number
    | {
        label: ReactNode | string;
        value: string | number;
        disabled?: boolean;
      }
  )[];
  typeKey2Name: Record<string, string>;
  priorityId2Color: Record<string, string>;
  handleIterationSelected?: (id: string) => void;
  afterDelete?: (id: string) => void;
  afterUpdate?: (demand: ScrumDemand) => void;
};

export type IterationPlanningRefProps = {
  getDemandByDraggableId: (draggableId: string) => ScrumDemand | null;
  removeDemand: (index: number) => void;
  addDemand: (demand: ScrumDemand, index: number) => void;
  removeDemandById: (id: string) => void;
  updateDemand: (demand: ScrumDemand) => void;
};

export default forwardRef(
  (
    props: PropsWithChildren<IterationPlanningProps>,
    ref: ForwardedRef<IterationPlanningRefProps>
  ) => {
    const history = useHistory();
    const [iterationId, setIterationId] = useState<string>(props.iterationId);
    const [demands, setDemands] = useState<ScrumDemand[]>([]);
    const [description, setDescription] = useState([]);

    function buildDraggableId(demandId: string): string {
      return DroppableId.IterationPlanning + demandId;
    }

    useImperativeHandle(ref, () => ({
      getDemandByDraggableId: (draggableId: string) => {
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
      removeDemand: (index: number) => {
        const newDemands = Array.from(demands);
        newDemands.splice(index, 1);
        setDemands([]);
        setDemands(newDemands);
      },
      addDemand: (newDemand: ScrumDemand, index: number) => {
        const demandForAdd = newDemand;
        demandForAdd.iteration_id = iterationId;
        const newDemands = Array.from(demands);
        newDemands.splice(index, 0, demandForAdd);
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
      updateDemand: (demand) => {
        const index = demands.findIndex((d) => d.id === demand.id);
        if (index < 0) {
          return;
        }
        const newDemands = Array.from(demands);
        newDemands.splice(index, 1, demand);
        setDemands([]);
        setDemands(newDemands);
      },
    }));

    useEffect(() => {
      setIterationId(props.iterationId);
    }, [props.iterationId]);

    useEffect(() => {
      setIterationId(undefined);
    }, [props.iterations]);

    useEffect(() => {
      if (props.handleIterationSelected) {
        props.handleIterationSelected(iterationId);
      }
      if (!iterationId) {
        return;
      }
      getIteration(iterationId).then((resp) => {
        setDescription([
          {
            label: '名称',
            value: resp.name,
          },
          {
            label: 'ID',
            value: <Typography.Text copyable>{resp.id}</Typography.Text>,
          },
          {
            label: '计划开始日期',
            value: resp.plan_start_date,
          },
          {
            label: '计划结束日期',
            value: resp.plan_end_date,
          },
          {
            label: '实际开始时间',
            value: resp.start_time,
          },
          {
            label: '实际结束时间',
            value: resp.end_time,
          },
          {
            label: '备注',
            value: resp.remark,
          },
        ]);
      });
      loadDemands();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [iterationId]);

    function loadDemands() {
      listDemand(iterationId).then((resp) => {
        setDemands([]);
        setDemands(resp);
      });
    }

    function handleClickKanban() {
      if (!iterationId) {
        Message.warning('请选择迭代');
        return;
      }
      NProgress.start();
      history.push(
        '/scrum/iteration-kanban' +
          window.location.search +
          '&iteration_id=' +
          iterationId
      );
      NProgress.done();
    }

    return (
      <Card
        bordered
        title={'规划迭代'}
        bodyStyle={{ paddingTop: 10, paddingRight: 3 }}
        extra={
          <Space>
            <Select
              value={iterationId}
              options={props.iterations}
              placeholder={'请选择迭代'}
              style={{ width: 300 }}
              onChange={(value) => setIterationId(value)}
            />
            <Button onClick={handleClickKanban}>
              Kanban
              <IconSend />
            </Button>
          </Space>
        }
      >
        {!iterationId ? (
          <Empty description={'请选择规划迭代'} />
        ) : (
          <>
            <Descriptions
              border
              column={2}
              data={description}
              style={{ paddingRight: 17 }}
            />
            {Object.keys(props.priorityId2Color).length > 0 && (
              <Droppable droppableId={DroppableId.IterationPlanning}>
                {(droppableProvided) => (
                  <div
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    <List
                      hoverable
                      dataSource={demands}
                      style={{
                        marginTop: 15,
                        height: DemandContainerHeight - 164,
                      }}
                      className={styles['demand-pool-card']}
                      render={(demand, index) => {
                        return (
                          <Draggable
                            draggableId={buildDraggableId(demand.id)}
                            index={index}
                            key={index}
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
                                    demand={demand}
                                    typeKey2Name={props.typeKey2Name}
                                    priorityId2Color={props.priorityId2Color}
                                    afterDelete={() => {
                                      loadDemands();
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
          </>
        )}
      </Card>
    );
  }
);
