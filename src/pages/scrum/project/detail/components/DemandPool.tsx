import { useEffect, useState } from 'react';
import { findToBePlanned } from '@/services/scrum/ScrumDemand';
import { Button, Card, Empty, List, message, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';

export default () => {
  const limit = 30;
  const { projectId } = useModel(PROJECT_DETAIL);

  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [toBePlanned, setToBePlanned] = useState<ScrumEntities.ScrumDemand[]>([]);

  useEffect(() => {
    if (projectId) {
      setLoading(true);
      findToBePlanned(projectId, offset, limit).then((demands) => {
        setToBePlanned(demands);
        setOffset(offset + demands.length);
        setHasMore(limit === demands.length);
        setLoading(false);
      });
    }
  }, [offset, projectId]);

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
          <Button type={'primary'} size={'small'} shape={'round'} icon={<PlusOutlined />}>
            创建需求
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
          <List
            dataSource={toBePlanned}
            renderItem={(item) => (
              <List.Item title={item.title}>
                <div>content</div>
              </List.Item>
            )}
            locale={{
              emptyText: (
                <Empty description={'无待规划需求'}>
                  <Button type="primary" icon={<PlusOutlined />}>
                    创建需求
                  </Button>
                </Empty>
              ),
            }}
          >
            {loading && <Spin />}
          </List>
        </InfiniteScroll>
      </Card>
    </>
  );
};
