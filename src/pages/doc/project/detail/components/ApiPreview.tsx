import { ApiTitle } from '@/pages/doc/project/detail';
import { Space } from 'antd';

interface ApiPreviewProps {
  apiId?: string;
}

export default (props: ApiPreviewProps) => {
  return (
    <Space direction={'vertical'}>
      <ApiTitle>基本信息{props.apiId}</ApiTitle>
      <div>这是基本信息</div>
      <ApiTitle>备注</ApiTitle>
      <div>这是备注信息</div>
      <ApiTitle>请求参数</ApiTitle>
      <div>这是请求参数信息</div>
      <ApiTitle>返回数据</ApiTitle>
      <div>这是返回数据</div>
    </Space>
  );
};
