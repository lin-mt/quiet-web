import { ApiTitle } from '@/pages/doc/project/detail';
import { Descriptions, Row, Space } from 'antd';
import type { ApiDetail } from '@/services/doc/EntityType';

interface ApiPreviewProps {
  apiDetail: ApiDetail;
}

export default (props: ApiPreviewProps) => {
  const { apiDetail } = props;

  return (
    <Space direction={'vertical'}>
      <ApiTitle>基本信息</ApiTitle>
      <Row>
        <Descriptions bordered={true} size={'middle'}>
          <Descriptions.Item label={'接口名称'}>{apiDetail.api.name}</Descriptions.Item>
        </Descriptions>
      </Row>
      <ApiTitle>备注</ApiTitle>
      <div>这是备注信息</div>
      <ApiTitle>请求参数</ApiTitle>
      <div>这是请求参数信息</div>
      <ApiTitle>返回数据</ApiTitle>
      <div>这是返回数据</div>
    </Space>
  );
};
