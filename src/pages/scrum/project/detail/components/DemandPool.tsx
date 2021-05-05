import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { findToBePlanned } from '@/services/scrum/ScrumDemand';
import { Button, Card, Empty, List, Spin } from 'antd';
import { CaretDownFilled, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';
import DemandForm from '@/pages/scrum/demand/components/DemandForm';
import type { ScrumDemand } from '@/services/scrum/EntitiyType';
import DemandCard from '@/pages/scrum/demand/components/DemandCard';
import { Draggable, Droppable } from 'react-beautiful-dnd';

export default forwardRef((_, ref) => {
  const limit = 6;
  const { projectId, priorities } = useModel(PROJECT_DETAIL);

  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
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

  function loadMoreDemandsToBePlanned() {
    if (hasMore && projectId) {
      setLoading(true);
      findToBePlanned(projectId, offset, limit).then((demands) => {
        setToBePlanned(toBePlanned.concat(demands));
        setOffset(offset + demands.length);
        setHasMore(limit === demands.length);
        setLoading(false);
      });
    }
  }

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
        <Droppable droppableId={'DemandPool'} type="TASK" isDropDisabled={false}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <List<ScrumDemand>
                dataSource={toBePlanned}
                grid={{ column: 1 }}
                loadMore={
                  projectId &&
                  hasMore &&
                  !loading && (
                    <div
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      <Button
                        size={'small'}
                        type={'text'}
                        style={{ width: '100%', borderRadius: '5px', backgroundColor: 'lightgrey' }}
                        onClick={loadMoreDemandsToBePlanned}
                        icon={<CaretDownFilled />}
                      />
                    </div>
                  )
                }
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
});
