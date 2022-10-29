import React, { useContext, useEffect, useState } from 'react';
import { Button, Message, Modal, Tabs } from '@arco-design/web-react';
import styles from './style/index.module.less';
import { IconDelete, IconPlus } from '@arco-design/web-react/icon';
import {
  deleteProjectEnv,
  listEnv,
  saveProjectEnv,
  updateProjectEnv,
} from '@/service/doc/project-env';
import { DocProjectEnv } from '@/service/doc/type';
import EnvForm from '@/components/doc/EnvForm';
import {
  ApiManagerContext,
  ApiManagerContextProps,
} from '@/pages/doc/api-manager';

const TabPane = Tabs.TabPane;

function Env() {
  const newEnvId = 'default';
  const apiManagerContext =
    useContext<ApiManagerContextProps>(ApiManagerContext);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState<string>();

  function fetchEnvs(newActiveTabKey?: string) {
    listEnv(apiManagerContext.projectId).then((resp) => {
      const envsTemp = [];
      resp.forEach((env) => {
        envsTemp.push({
          title: env.name,
          key: env.id,
          env: env,
        });
      });
      if (newActiveTabKey) {
        setActiveTab(newActiveTabKey);
      } else if (envsTemp.length > 0) {
        setActiveTab(envsTemp[0].key);
      }
      setTabs(envsTemp);
    });
  }

  useEffect(() => {
    fetchEnvs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiManagerContext.projectId]);

  const handleAddTab = () => {
    const newEnv = {
      title: '新环境',
      key: newEnvId,
      env: {
        name: '新环境',
        project_id: apiManagerContext.projectId,
      },
    };
    for (const tab of tabs) {
      if (tab.key === newEnvId) {
        Message.warning(`${tab.title} 的配置还未保存，请先保存！`);
        return;
      }
    }
    setTabs([...tabs, newEnv]);
    setActiveTab(newEnv.key);
  };

  const handleDeleteTab = (key) => {
    const index = tabs.findIndex((x) => x.key === key);
    const removeTab = () => {
      const newTabs = tabs.slice(0, index).concat(tabs.slice(index + 1));
      if (key === activeTab && index > -1 && newTabs.length) {
        setActiveTab(
          newTabs[index] ? newTabs[index].key : newTabs[index - 1].key
        );
      }
      if (index > -1) {
        setTabs(newTabs);
      }
    };
    if (newEnvId !== key) {
      Modal.confirm({
        title: `确认删除环境 ${tabs[index].title} 吗？`,
        onOk: () => {
          deleteProjectEnv(key).then(() => {
            removeTab();
          });
        },
      });
    } else {
      removeTab();
    }
  };

  function handleSaveEnv(env: DocProjectEnv): Promise<DocProjectEnv> {
    let result: Promise<DocProjectEnv>;
    if (!env.id) {
      result = saveProjectEnv(env);
    } else {
      result = updateProjectEnv(env);
    }
    return result.then((resp) => {
      fetchEnvs(resp.id);
      return resp;
    });
  }

  return (
    <Tabs
      editable
      className={styles['setting-env']}
      type="card-gutter"
      tabPosition="left"
      activeTab={activeTab}
      onAddTab={handleAddTab}
      onDeleteTab={handleDeleteTab}
      onChange={setActiveTab}
      addButton={
        <Button size={'small'} type={'primary'} icon={<IconPlus />}>
          新增环境
        </Button>
      }
      deleteButton={
        <span className={'arco-icon-hover arco-tabs-icon-hover'}>
          <IconDelete />
        </span>
      }
    >
      {tabs.map((value) => {
        return (
          <TabPane destroyOnHide key={value.key} title={value.title}>
            <EnvForm envInfo={value.env} onSubmit={handleSaveEnv} />
          </TabPane>
        );
      })}
    </Tabs>
  );
}

export default Env;
