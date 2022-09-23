import React, { createContext, useEffect, useState } from 'react';
import { Button, Spin, Tabs } from '@arco-design/web-react';
import styles from './style/index.module.less';
import { getQueryParams } from '@/utils/getUrlParams';
import Api from '@/pages/doc/api-manager/api';
import Setting from '@/pages/doc/api-manager/setting';
import { DocProject } from '@/service/doc/type';
import { getProjectInfo } from '@/service/doc/project';

const TabPane = Tabs.TabPane;

export type ApiManagerContextProps = {
  loading: boolean;
  setLoading: (state: boolean) => void;
  projectId: string;
  projectInfo: DocProject;
  setProjectId: (id: string) => void;
  setProjectInfo: (info: DocProject) => void;
};

export const ApiManagerContext =
  createContext<ApiManagerContextProps>(undefined);

function ApiManager() {
  const query = getQueryParams();
  const [projectId, setProjectId] = useState<string>();
  const [projectInfo, setProjectInfo] = useState<DocProject>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setProjectId(query.projectId);
  }, [query.projectId]);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    setLoading(true);
    getProjectInfo(projectId)
      .then((res) => {
        setProjectInfo(res);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

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
    <Spin block loading={loading} size={30} style={{ width: '100%' }}>
      <ApiManagerContext.Provider
        value={{
          loading,
          setLoading,
          projectId,
          setProjectId,
          projectInfo,
          setProjectInfo,
        }}
      >
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
            <Api />
          </TabPane>
          <TabPane key={'setting'} title={'设 置'}>
            <Setting />
          </TabPane>
        </Tabs>
      </ApiManagerContext.Provider>
    </Spin>
  );
}

export default ApiManager;
