import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { deleteDemand, findToBePlanned } from '@/services/scrum/ScrumDemand';
import { Button, Card, Empty, List, Select, Space, Spin } from 'antd';
import { CaretDownFilled, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';
import DemandForm from '@/pages/scrum/demand/components/DemandForm';
import type { ScrumDemand } from '@/services/scrum/EntitiyType';
import DemandCard from '@/pages/scrum/demand/components/DemandCard';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { DroppableId, LoadingMoreContainer } from '@/pages/scrum/project/detail/components/Common';
import { DictionaryType } from '@/types/Type';
import { DICTIONARY } from '@/constant/system/Modelnames';
import { filterStyle } from '@/utils/RenderUtils';
import type { QuietDictionary } from '@/services/system/EntityType';

export interface ScrumDemandFilter {
  planned?: string;
  priorityId?: string;
  demandType?: string;
}

export default forwardRef((_, ref) => {
  const limit = 6;
  const { projectId, priorities, priorityColors } = useModel(PROJECT_DETAIL);
  const { getDictionaryLabels, getDictionariesByType } = useModel(DICTIONARY);

  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [demandFormVisible, setDemandFormVisible] = useState<boolean>(false);
  const [demandUpdateInfo, setDemandUpdateInfo] = useState<ScrumDemand>();
  const [toBePlanned, setToBePlanned] = useState<ScrumDemand[]>([]);
  const [demandType, setDemandType] = useState<QuietDictionary[]>([]);
  const [demandTypeLabels, setDemandTypeLabels] = useState<Record<string, string>>({});
  const [demandFilter, setDemandFilter] = useState<ScrumDemandFilter>({});

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

  const refreshToBePlanned = useCallback(async () => {
    if (projectId) {
      setLoading(true);
      await findToBePlanned(projectId, demandFilter, 0, limit).then((demands) => {
        setToBePlanned(demands);
        setOffset(demands.length);
        setHasMore(limit === demands.length);
      });
      await getDictionaryLabels(DictionaryType.DemandType).then((labels) =>
        setDemandTypeLabels(labels),
      );
      await getDictionariesByType(DictionaryType.DemandType).then((dictionaries) => {
        setDemandType(dictionaries);
      });
      setLoading(false);
    }
  }, [demandFilter, getDictionariesByType, getDictionaryLabels, projectId]);

  useEffect(() => {
    refreshToBePlanned().then();
  }, [refreshToBePlanned]);

  function loadMoreDemandsToBePlanned() {
    if (hasMore && projectId) {
      setLoading(true);
      findToBePlanned(projectId, demandFilter, offset, limit).then((demands) => {
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
        bordered={false}
        bodyStyle={{ paddingTop: 6, paddingBottom: 6 }}
        extra={
          <Space size={'large'}>
            <Space>
              <Select
                size={'small'}
                bordered={false}
                allowClear={true}
                style={{ ...filterStyle, width: 93 }}
                placeholder={'需求类型'}
                options={demandType.map((d) => ({ label: d.label, value: `${d.type}.${d.key}` }))}
                onChange={(value) =>
                  setDemandFilter({ ...demandFilter, demandType: value?.toString() })
                }
              />
              <Select
                size={'small'}
                bordered={false}
                allowClear={true}
                style={{ ...filterStyle, width: 93 }}
                placeholder={'优先级'}
                options={priorities.map((p) => ({ label: p.name, value: p.id }))}
                onChange={(value) =>
                  setDemandFilter({ ...demandFilter, priorityId: value?.toString() })
                }
              />
            </Space>
            <Button
              type={'primary'}
              size={'small'}
              shape={'round'}
              icon={<PlusOutlined />}
              onClick={() => setDemandFormVisible(true)}
            >
              需求
            </Button>
          </Space>
        }
      >
        <Droppable droppableId={DroppableId.DemandPool} type="TASK" isDropDisabled={false}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <List<ScrumDemand>
                dataSource={toBePlanned}
                grid={{ column: 1 }}
                renderItem={(demand, index) => (
                  <Draggable
                    draggableId={demand.id}
                    index={index}
                    isDragDisabled={!!demand.iterationId}
                  >
                    {(demandProvider) => (
                      <div
                        {...demandProvider.draggableProps}
                        {...demandProvider.dragHandleProps}
                        ref={demandProvider.innerRef}
                      >
                        <List.Item style={{ margin: 0, paddingBottom: 6, paddingTop: 6 }}>
                          <DemandCard
                            demand={demand}
                            cardStyle={
                              demand.iterationId
                                ? {
                                    backgroundColor: '#ececec',
                                    cursor: 'pointer',
                                  }
                                : undefined
                            }
                            onEditClick={() => {
                              setDemandUpdateInfo(demand);
                              setDemandFormVisible(true);
                            }}
                            onDeleteClick={async () => {
                              await deleteDemand(demand.id);
                              refreshToBePlanned().then();
                            }}
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
      {projectId && toBePlanned.length > 0 && (
        <LoadingMoreContainer>
          {hasMore ? (
            <Button
              size={'small'}
              type={'text'}
              loading={loading}
              style={{ width: '100%', backgroundColor: 'lightgrey' }}
              onClick={loadMoreDemandsToBePlanned}
              icon={<CaretDownFilled />}
            />
          ) : (
            '已无更多需求...'
          )}
        </LoadingMoreContainer>
      )}
      {demandFormVisible && projectId && (
        <DemandForm
          visible={demandFormVisible}
          projectId={projectId}
          updateInfo={demandUpdateInfo}
          priorities={priorities}
          onCancel={() => {
            setDemandFormVisible(false);
            setDemandUpdateInfo(undefined);
          }}
          afterAction={refreshToBePlanned}
        />
      )}
    </>
  );
});
