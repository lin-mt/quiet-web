import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Link, useModel } from 'umi';
import { Button, Card, Empty, List, Space, Spin, TreeSelect } from 'antd';
import { disableTreeNode } from '@/utils/scrum/utils';
import { findAllDemandsById } from '@/services/scrum/ScrumIteration';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';
import type { ScrumDemand } from '@/services/scrum/EntitiyType';
import DemandCard from '@/pages/scrum/demand/components/DemandCard';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ForwardFilled } from '@ant-design/icons';

export default forwardRef((_, ref) => {
  const { versions, selectedIterationId, setSelectedIterationId } = useModel(PROJECT_DETAIL);
  const [loading, setLoading] = useState<boolean>(false);
  const [iterationDemands, setIterationDemands] = useState<ScrumDemand[]>([]);

  useImperativeHandle(ref, () => ({
    getDemandById: (demandId: string): ScrumDemand | null => {
      let demand = null;
      iterationDemands.every((datum) => {
        if (datum.id === demandId) {
          demand = datum;
          return false;
        }
        return true;
      });
      return demand;
    },
    removeDemand: (index: number) => {
      const newToBePlanned = Array.from(iterationDemands);
      newToBePlanned.splice(index, 1);
      setIterationDemands(newToBePlanned);
    },
    addDemand: (newDemand: ScrumDemand, index: number) => {
      const demandForAdd = newDemand;
      demandForAdd.iterationId = selectedIterationId;
      const newToBePlanned = Array.from(iterationDemands);
      newToBePlanned.splice(index, 0, demandForAdd);
      setIterationDemands(newToBePlanned);
    },
  }));

  useEffect(() => {
    if (selectedIterationId) {
      setLoading(true);
      findAllDemandsById(selectedIterationId).then((demands) => {
        setIterationDemands(demands);
        setLoading(false);
      });
    }
  }, [selectedIterationId]);

  return (
    <>
      <Card
        title={'需求规划'}
        size={'small'}
        extra={
          <Space>
            <TreeSelect
              size={'small'}
              showSearch={true}
              style={{ width: '300px' }}
              treeNodeFilterProp={'title'}
              defaultValue={selectedIterationId}
              onSelect={(value) => setSelectedIterationId(value.toString())}
              placeholder={'请选择需求规划的迭代'}
              treeData={disableTreeNode(versions)}
            />
            <Link to={`/scrum/project/iteration/?iterationId=${selectedIterationId}`}>
              <Button icon={<ForwardFilled />} type={'primary'} shape={'round'} size={'small'} />
            </Link>
          </Space>
        }
      >
        <Droppable droppableId={'DemandPlanning'} type="TASK">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <List<ScrumDemand>
                dataSource={iterationDemands}
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
                    <Empty
                      description={
                        !selectedIterationId
                          ? '请选择需求要规划的迭代'
                          : '请从需求池拖拽需求进行需求规划'
                      }
                    />
                  ),
                }}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Card>
    </>
  );
});
