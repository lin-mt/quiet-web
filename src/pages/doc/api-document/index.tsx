import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { Empty, Grid, Tabs } from '@arco-design/web-react';
import styles from './style/index.module.less';
import { getQueryParams, updateUrlParam } from '@/utils/urlParams';
import Api from '@/pages/doc/api-document/api';
import Setting from '@/pages/doc/api-document/setting';
import { DocProject } from '@/service/doc/type';
import { getProjectInfo } from '@/service/doc/project';
import ProjectSelect from '@/components/doc/ProjectSelect';
import ProjectGroupSelect, {
  PERSONAL_VALUE,
} from '@/components/doc/ProjectGroupSelect';
import { LocalStorage } from '@/constant/doc';
import Data from '@/pages/doc/api-document/data';

const TabPane = Tabs.TabPane;
const { Row, Col } = Grid;

export type QueryParams = {
  group_id?: string;
  project_id?: string;
  api_group_id?: string;
  api_id?: string;
};

function getParams(): QueryParams {
  const query = getQueryParams();
  let local: QueryParams = {};
  if (query.group_id || query.project_id) {
    local = { ...query };
  } else {
    const params = localStorage.getItem(LocalStorage.ApiManager);
    if (params) {
      local = JSON.parse(params);
    }
  }
  return local;
}

export type ApiManagerContextProps = {
  loading: boolean;
  setLoading: (state: boolean) => void;
  queryParams: QueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<QueryParams>>;
  projectInfo: DocProject;
  setProjectInfo: (info: DocProject) => void;
};

export const ApiManagerContext =
  createContext<ApiManagerContextProps>(undefined);

function ApiManager() {
  const [queryParams, setQueryParams] = useState<QueryParams>(getParams());
  const [projectInfo, setProjectInfo] = useState<DocProject>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    if (!queryParams.project_id) {
      setProjectInfo(undefined);
      return;
    }
    setLoading(true);
    getProjectInfo(queryParams.project_id)
      .then((res) => {
        setProjectInfo(res);
      })
      .finally(() => setLoading(false));
  }, [queryParams.project_id]);

  useEffect(() => {
    const params: QueryParams = {
      ...queryParams,
      group_id:
        PERSONAL_VALUE === queryParams.group_id
          ? undefined
          : queryParams.group_id,
    };
    updateUrlParam(params);
    localStorage.setItem(LocalStorage.ApiManager, JSON.stringify(params));
    // eslint-disable-next-line
  }, [JSON.stringify(queryParams)]);

  const renderTabHeader = (props, DefaultTabBar) => {
    return (
      <div className={styles['api-document-tab-header']}>
        <DefaultTabBar {...props}>
          {(node) => {
            return <span>{node}</span>;
          }}
        </DefaultTabBar>
      </div>
    );
  };

  function buildTabContent(content: ReactNode): ReactNode {
    if (queryParams.project_id) {
      return content;
    }
    return (
      <Empty
        style={{ backgroundColor: 'var(--color-bg-1)' }}
        description={`请选择${queryParams.group_id ? '项目' : '项目分组'}`}
      />
    );
  }

  return (
    <ApiManagerContext.Provider
      value={{
        loading,
        setLoading,
        queryParams,
        setQueryParams,
        projectInfo,
        setProjectInfo,
      }}
    >
      <Tabs
        defaultActiveTab={'api'}
        renderTabHeader={renderTabHeader}
        extra={
          <Row
            gutter={15}
            style={{
              width: 600,
              paddingRight: 16,
              color: 'var(--color-text-2)',
            }}
          >
            <Col flex={1}>
              <Row gutter={5}>
                <Col flex={'50px'}>项目组</Col>
                <Col flex={'auto'}>
                  <ProjectGroupSelect
                    personal
                    value={queryParams.group_id}
                    placeholder={'请选择项目组'}
                    onChange={(value) => {
                      setQueryParams({
                        group_id: value,
                        project_id: undefined,
                      });
                    }}
                  />
                </Col>
              </Row>
            </Col>
            <Col flex={1}>
              <Row gutter={5}>
                <Col flex={'39px'}>项目</Col>
                <Col flex={'auto'}>
                  <ProjectSelect
                    groupId={
                      PERSONAL_VALUE === queryParams.group_id
                        ? undefined
                        : queryParams.group_id
                    }
                    value={queryParams.project_id}
                    placeholder={'请选择项目'}
                    onChange={(value) => {
                      setQueryParams((prevState) => {
                        return {
                          group_id: prevState.group_id,
                          project_id: value,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        }
      >
        <TabPane key={'api'} title={'接 口'}>
          {buildTabContent(<Api />)}
        </TabPane>
        <TabPane key={'data'} title={'数据管理'}>
          {buildTabContent(<Data />)}
        </TabPane>
        <TabPane key={'setting'} title={'设 置'}>
          {buildTabContent(<Setting />)}
        </TabPane>
      </Tabs>
    </ApiManagerContext.Provider>
  );
}

export default ApiManager;
