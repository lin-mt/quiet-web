import { ApiTitle } from '@/pages/doc/project/detail';
import { Badge, Descriptions, Space, Tag } from 'antd';
import type { ApiDetail } from '@/services/doc/EntityType';
import { getMethodTagColor } from '@/utils/doc/utils';
import { ApiState } from '@/services/doc/Enums';

interface ApiPreviewProps {
  apiDetail: ApiDetail;
}

export default (props: ApiPreviewProps) => {
  const { apiDetail } = props;

  return (
    <Space direction={'vertical'}>
      <ApiTitle>基本信息</ApiTitle>
      <Descriptions bordered={true} size={'middle'} style={{ padding: 20 }} column={2}>
        <Descriptions.Item label={'接口名称'}>{apiDetail.api.name}</Descriptions.Item>
        <Descriptions.Item label={'创建人'}>{apiDetail.api.creator_full_name}</Descriptions.Item>
        <Descriptions.Item label={'状态'}>
          <Badge
            status={apiDetail.api.api_state === ApiState.FINISHED ? 'success' : 'processing'}
            text={apiDetail.api.api_state === ApiState.FINISHED ? '完成' : '未完成'}
          />
        </Descriptions.Item>
        <Descriptions.Item label={'更新时间'}>{apiDetail.api.gmt_update}</Descriptions.Item>
        <Descriptions.Item label={'接口路径'}>
          <Tag color={getMethodTagColor(apiDetail.api.method)}>{apiDetail.api.method}</Tag>
          {apiDetail.api.path}
        </Descriptions.Item>
      </Descriptions>
      <ApiTitle>备注</ApiTitle>
      <div>这是备注信息</div>
      <ApiTitle>请求参数</ApiTitle>
      <div>这是请求参数信息</div>
      <ApiTitle>返回数据</ApiTitle>
      <div>这是返回数据</div>
    </Space>
  );
};
