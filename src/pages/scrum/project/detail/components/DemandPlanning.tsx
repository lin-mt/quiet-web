import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Card, Empty, List, Spin, TreeSelect } from 'antd';
import { disableTreeNode } from '@/utils/scrum/utils';
import { findAllDemandsById } from '@/services/scrum/ScrumIteration';
import { ProjectDetail } from '@/constant/scrum/ModelNames';

export default () => {
  const { versions } = useModel(ProjectDetail);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedIterationId, setSelectedIterationId] = useState<string>();
  const [iterationDemands, setIterationDemands] = useState<ScrumEntities.ScrumDemand[]>();

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
          <TreeSelect
            showSearch={true}
            allowClear={true}
            style={{ width: '300px' }}
            treeNodeFilterProp={'title'}
            onSelect={(value) => setSelectedIterationId(value.toString())}
            placeholder={'请选择需求规划的迭代'}
            treeData={disableTreeNode(versions)}
          />
        }
      >
        <List
          dataSource={iterationDemands}
          renderItem={(item) => {
            const demand: ScrumEntities.ScrumDemand = item;
            return (
              <List.Item title={demand.title}>
                <div>{demand.remark}</div>
              </List.Item>
            );
          }}
          locale={{
            emptyText: (
              <Empty
                description={
                  !selectedIterationId ? '请选择需求要规划的迭代' : '请从需求池拖拽需求进行需求规划'
                }
              />
            ),
          }}
        >
          {loading && <Spin />}
        </List>
      </Card>
    </>
  );
};
