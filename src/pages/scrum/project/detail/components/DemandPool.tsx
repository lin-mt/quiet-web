import { useCallback, useEffect, useState } from 'react';
import { findToBePlanned } from '@/services/scrum/ScrumDemand';
import { Button, Card, Empty, List, message, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';
import DemandForm from '@/pages/scrum/demand/components/DemandForm';
import type { ScrumDemand } from '@/services/scrum/EntitiyType';

export default () => {
  const limit = 30;
  const { projectId, priorities } = useModel(PROJECT_DETAIL);

  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [demandFormVisible, setDemandFormVisible] = useState<boolean>(false);
  const [toBePlanned, setToBePlanned] = useState<ScrumDemand[]>([]);

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

  const loadMoreDemandsToBePlanned = () => {
    if (hasMore && projectId) {
      setLoading(true);
      findToBePlanned(projectId, offset, limit).then((demands) => {
        setToBePlanned(toBePlanned.concat(demands));
        setOffset(offset + demands.length);
        setHasMore(limit === demands.length);
        setLoading(false);
        if (!hasMore) {
          message.info('已无更多待规划的需求！');
        }
      });
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
          <List<ScrumDemand>
            dataSource={toBePlanned}
            renderItem={(item) => (
              <List.Item title={item.title}>
                <div>{item.title}</div>
              </List.Item>
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
