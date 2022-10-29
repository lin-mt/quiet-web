import React from 'react';
import { Layout, Space } from '@arco-design/web-react';
import { FooterProps } from '@arco-design/web-react/es/Layout/interface';
import cs from 'classnames';
import styles from './style/index.module.less';
import { IconGithub } from '@arco-design/web-react/icon';

function Footer(props: FooterProps = {}) {
  const currentYear = new Date().getFullYear();

  const { className, ...restProps } = props;
  return (
    <Layout.Footer className={cs(styles.footer, className)} {...restProps}>
      <Space direction={'vertical'}>
        <a className="arco-icon" href={'https://github.com/lin-mt/quiet-web'}>
          <IconGithub />
        </a>
        <div>ⓒ Copyright Quiet 2020-{currentYear}</div>
      </Space>
    </Layout.Footer>
  );
}

export default Footer;
