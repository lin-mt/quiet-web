import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Link, useModel } from 'umi';
import { Button, Card, Empty, List, Space, Spin, Tooltip, TreeSelect } from 'antd';
import { disableVersionNode } from '@/utils/scrum/utils';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';
import type { ScrumDemand } from '@/services/scrum/EntitiyType';
import DemandCard from '@/pages/scrum/demand/components/DemandCard';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { CaretDownFilled, ForwardFilled } from '@ant-design/icons';
import { scrollByIterationId } from '@/services/scrum/ScrumDemand';
import { DroppableId, LoadingMoreContainer } from '@/pages/scrum/project/detail/components/Common';
import { filterStyle } from '@/utils/RenderUtils';
import { DICTIONARY } from '@/constant/system/ModelNames';
import { DictionaryType } from '@/types/Type';

export default forwardRef((_, ref) => {
  const limit = 6;

  const { projectId, versions, priorityColors, selectedIterationId, setSelectedIterationId } =
    useModel(PROJECT_DETAIL);
  const { getDictionaryLabelByType } = useModel(DICTIONARY);

  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [iterationDemands, setIterationDemands] = useState<ScrumDemand[]>([]);
  const [demandTypeLabels, setDemandTypeLabels] = useState<Record<string, string>>({});

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
      scrollByIterationId(selectedIterationId, 0, limit).then(async (demands) => {
        demands.concat();
        setIterationDemands(demands);
        setOffset(demands.length);
        setHasMore(limit === demands.length);
        await getDictionaryLabelByType(DictionaryType.DemandType).then((labels) =>
          setDemandTypeLabels(labels),
        );
        setLoading(false);
      });
    }
  }, [getDictionaryLabelByType, selectedIterationId]);

  function loadMoreDemandsInIteration() {
    if (hasMore && selectedIterationId) {
      setLoading(true);
      scrollByIterationId(selectedIterationId, offset, limit).then((demands) => {
        setIterationDemands(iterationDemands.concat(demands));
        setOffset(offset + demands.length);
        setHasMore(limit === demands.length);
        setLoading(false);
      });
    }
  }

  return (
    <>
      <Card
        title={'需求规划'}
        size={'small'}
        bordered={false}
        bodyStyle={{ paddingTop: 6, paddingBottom: 6 }}
        extra={
          <Space>
            <TreeSelect
              size={'small'}
              virtual={false}
              treeIcon={true}
              bordered={false}
              showSearch={true}
              style={{ ...filterStyle, width: '200px' }}
              treeNodeFilterProp={'title'}
              defaultValue={selectedIterationId}
              onSelect={(value) => setSelectedIterationId(value.toString())}
              placeholder={'请选择需求规划的迭代'}
              treeData={disableVersionNode(versions)}
            />
            <Link
              to={`/scrum/project/iteration?projectId=${projectId}&iterationId=${selectedIterationId}`}
            >
              <Tooltip title={selectedIterationId ? '' : '请选择需求要规划的迭代'}>
                <Button
                  icon={<ForwardFilled />}
                  type={'primary'}
                  shape={'round'}
                  size={'small'}
                  disabled={!selectedIterationId}
                />
              </Tooltip>
            </Link>
          </Space>
        }
      >
        <Droppable droppableId={DroppableId.DemandPlanning} type="TASK">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <List<ScrumDemand>
                grid={{ column: 1 }}
                dataSource={iterationDemands}
                renderItem={(demand, index) => (
                  <Draggable draggableId={demand.id} index={index}>
                    {(demandProvider) => (
                      <div
                        {...demandProvider.draggableProps}
                        {...demandProvider.dragHandleProps}
                        ref={demandProvider.innerRef}
                      >
                        <List.Item style={{ margin: 0, paddingBottom: 6, paddingTop: 6 }}>
                          <DemandCard
                            demand={demand}
                            demandTypeLabels={demandTypeLabels}
                            priorityColors={priorityColors}
                          />
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
      {selectedIterationId && iterationDemands.length > 0 && (
        <LoadingMoreContainer>
          {hasMore ? (
            <Button
              size={'small'}
              type={'text'}
              loading={loading}
              style={{ width: '100%', backgroundColor: 'lightgrey' }}
              onClick={loadMoreDemandsInIteration}
              icon={<CaretDownFilled />}
            />
          ) : (
            '已无更多需求...'
          )}
        </LoadingMoreContainer>
      )}
    </>
  );
});
