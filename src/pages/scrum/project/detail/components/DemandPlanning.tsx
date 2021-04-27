import { Button, Card, Empty, List, Spin } from 'antd';

export default () => {
  return (
    <>
      <Card title={'需求规划'} size={'small'}>
        <List
          dataSource={[]}
          renderItem={(item) => (
            <List.Item title={item}>
              <div>content</div>
            </List.Item>
          )}
          locale={{
            emptyText: (
              <Empty>
                <Button type="primary">创建</Button>
              </Empty>
            ),
          }}
        >
          {<Spin />}
        </List>
      </Card>
    </>
  );
};
