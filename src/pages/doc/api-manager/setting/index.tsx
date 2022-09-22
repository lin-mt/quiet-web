import React from 'react';
import { Card, Tabs } from '@arco-design/web-react';
import styles from './style/index.module.less';
import Env from '@/pages/doc/api-manager/setting/env';
const TabPane = Tabs.TabPane;
export type SettingProps = {
  projectId: string;
};

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

function Setting(props: SettingProps) {
  return (
    <Card
      className={styles.setting}
      bodyStyle={{ paddingTop: 0, paddingLeft: 15, paddingRight: 15 }}
    >
      <Tabs defaultActiveTab={'env'} renderTabHeader={renderTabHeader}>
        <TabPane disabled title={'项目配置'} key={'project'}>
          项目配置 {props.projectId}
        </TabPane>
        <TabPane title={'环境配置'} key={'env'}>
          <Env projectId={props.projectId} />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default Setting;
