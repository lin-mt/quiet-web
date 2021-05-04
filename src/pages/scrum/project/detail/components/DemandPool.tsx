import type { Ref } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { findToBePlanned } from '@/services/scrum/ScrumDemand';
import { Button, Card, Empty, List, message, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';
import DemandForm from '@/pages/scrum/demand/components/DemandForm';
import type { ScrumDemand } from '@/services/scrum/EntitiyType';
import DemandCard from '@/pages/scrum/demand/components/DemandCard';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const DemandPool = (_: any, ref: Ref<any> | undefined) => {
  const limit = 30;
  const { projectId, priorities } = useModel(PROJECT_DETAIL);

  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [demandFormVisible, setDemandFormVisible] = useState<boolean>(false);
  const [toBePlanned, setToBePlanned] = useState<ScrumDemand[]>([]);

  useImperativeHandle(ref, () => ({
    getDemandById: (demandId: string): ScrumDemand | null => {
      let demand = null;
      toBePlanned.every((datum) => {
        if (datum.id === demandId) {
          demand = datum;
          return false;
        }
        return true;
      });
      return demand;
    },
    removeDemand: (index: number) => {
      const newToBePlanned = Array.from(toBePlanned);
      newToBePlanned.splice(index, 1);
      setToBePlanned(newToBePlanned);
    },
    addDemand: (newDemand: ScrumDemand, index: number) => {
      const demandForAdd = newDemand;
      demandForAdd.iterationId = undefined;
      const newToBePlanned = Array.from(toBePlanned);
      newToBePlanned.splice(index, 0, demandForAdd);
      setToBePlanned(newToBePlanned);
    },
  }));

  const initToBePlanned = useCallback(() => {
    if (projectId) {
      setLoading(true);
      findToBePlanned(projectId, 0, limit).then((demands) => {
        setToBePlanned(demands);
        setOffset(demands.length);
        setHasMore(limit === demands.length);
        setLoading(false);
      });
    }
  }, [projectId]);

  useEffect(() => {
    initToBePlanned();
  }, [initToBePlanned]);

  const loadMoreDemandsToBePlanned = async () => {
    if (hasMore && projectId) {
      setLoading(true);
      await findToBePlanned(projectId, offset, limit).then((demands) => {
        setToBePlanned(toBePlanned.concat(demands));
        setOffset(offset + demands.length);
        setHasMore(limit === demands.length);
        setLoading(false);
      });
      if (!hasMore) {
        message.info('已无更多待规划的需求！');
      }
    }
  };

  return (
    <>
      <Card
        title={'需求池'}
        size={'small'}
        extra={
          <Button
            type={'primary'}
            size={'small'}
            shape={'round'}
            icon={<PlusOutlined />}
            onClick={() => setDemandFormVisible(true)}
          >
            新建需求
          </Button>
        }
      >
        <InfiniteScroll
          initialLoad={true}
          pageStart={0}
          loadMore={loadMoreDemandsToBePlanned}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
          <Droppable droppableId={'DemandPool'} type="TASK" isDropDisabled={false}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <List<ScrumDemand>
                  dataSource={toBePlanned}
                  grid={{ column: 1 }}
                  renderItem={(demand, index) => (
                    <Draggable draggableId={demand.id} index={index}>
                      {(demandProvider) => (
                        <div
                          {...demandProvider.draggableProps}
                          {...demandProvider.dragHandleProps}
                          ref={demandProvider.innerRef}
                        >
                          <List.Item style={{ marginBottom: '12px' }}>
                            <DemandCard demand={demand} />
                          </List.Item>
                        </div>
                      )}
                    </Draggable>
                  )}
                  locale={{
                    emptyText: loading ? (
                      <Spin />
                    ) : (
                      <Empty description={'无待规划需求'}>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => setDemandFormVisible(true)}
                        >
                          新建需求
                        </Button>
                      </Empty>
                    ),
                  }}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </InfiniteScroll>
      </Card>
      {demandFormVisible && projectId && (
        <DemandForm
          visible={demandFormVisible}
          projectId={projectId}
          priorities={priorities}
          onCancel={() => setDemandFormVisible(false)}
          afterAction={initToBePlanned}
        />
      )}
    </>
  );
};

export default forwardRef(DemandPool);
