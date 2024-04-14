import { FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Menu, MenuProps } from 'antd';
import React from 'react';

const ApiDocs: React.FC = () => {
  const [key, setKey] = React.useState<string>('api');

  const items: MenuProps['items'] = [
    {
      label: '接 口',
      key: 'api',
      icon: <FileTextOutlined />,
    },
    {
      label: '设 置',
      key: 'setting',
      icon: <SettingOutlined />,
    },
  ];

  return (
    <PageContainer title={false}>
      <Menu selectedKeys={[key]} onClick={(e) => setKey(e.key)} mode="horizontal" items={items} />
    </PageContainer>
  );
};

export default ApiDocs;
