import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="lin-mt@outlook.com"
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/lin-mt/quiet',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
