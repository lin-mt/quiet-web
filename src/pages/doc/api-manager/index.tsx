import React from 'react';
import { Button, Tabs } from '@arco-design/web-react';
import styles from './style/index.module.less';
import { getQueryParams } from '@/utils/getUrlParams';
import Api from '@/pages/doc/api-manager/api';
import Setting from '@/pages/doc/api-manager/setting';

const TabPane = Tabs.TabPane;

function ApiManager() {
  const query = getQueryParams();

  const renderTabHeader = (props, DefaultTabBar) => {
    return (
      <div className={styles['api-manager-tab-header']}>
        <DefaultTabBar {...props}>
          {(node) => {
            return <span>{node}</span>;
          }}
        </DefaultTabBar>
      </div>
    );
  };

  return (
    <Tabs
      defaultActiveTab={'setting'}
      renderTabHeader={renderTabHeader}
      extra={
        <div style={{ paddingRight: 16 }}>
          <Button disabled type={'primary'}>
            切换项目
          </Button>
        </div>
      }
    >
      <TabPane key={'api'} title={'接 口'}>
        <Api projectId={query.projectId} />
      </TabPane>
      <TabPane key={'setting'} title={'设 置'}>
        <Setting projectId={query.projectId} />
      </TabPane>
    </Tabs>
  );
}

export default ApiManager;
