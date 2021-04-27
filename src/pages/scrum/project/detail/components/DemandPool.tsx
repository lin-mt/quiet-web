import { useEffect, useState } from 'react';
import { findToBePlanned } from '@/services/scrum/ScrumDemand';
import { Button, Card, Empty, List, Spin } from 'antd';

type DemandPoolListProps = {
  projectId: string;
};

export default (props: DemandPoolListProps) => {
  const limit = 30;
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [toBePlanned, setToBePlanned] = useState<ScrumEntities.ScrumDemand[]>([]);

  useEffect(() => {
    setLoading(true);
    findToBePlanned(props.projectId, offset, limit).then((demands) => {
      setToBePlanned(demands);
      setOffset(offset + demands.length);
      setLoading(false);
    });
  }, [offset, props.projectId]);

  return (
    <>
      <Card title={'需求池'} size={'small'}>
        <List
          dataSource={toBePlanned}
          renderItem={(item) => (
            <List.Item title={item.title}>
              <div>content</div>
            </List.Item>
          )}
          locale={{
            emptyText: (
              <Empty>
                <Button type="primary">创建需求</Button>
              </Empty>
            ),
          }}
        >
          {loading && <Spin />}
        </List>
      </Card>
    </>
  );
};
