import React from 'react';
import { Card, Tabs } from '@arco-design/web-react';
import styles from './style/index.module.less';
import Env from '@/pages/doc/api-document/setting/env';
import Project from '@/pages/doc/api-document/setting/project';

const TabPane = Tabs.TabPane;

const renderTabHeader = (props, DefaultTabBar) => {
  return (
    <div className={styles['setting-tab-header']}>
      <DefaultTabBar {...props}>
        {(node) => {
          return <span>{node}</span>;
        }}
      </DefaultTabBar>
    </div>
  );
};

function Setting() {
  return (
    <Card
      className={styles.setting}
      bodyStyle={{ paddingTop: 0, paddingLeft: 15, paddingRight: 15 }}
    >
      <Tabs defaultActiveTab={'project'} renderTabHeader={renderTabHeader}>
        <TabPane title={'项目配置'} key={'project'}>
          <Project />
        </TabPane>
        <TabPane title={'环境配置'} key={'env'}>
          <Env />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default Setting;
