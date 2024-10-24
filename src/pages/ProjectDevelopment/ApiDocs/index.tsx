import Docs from '@/pages/ProjectDevelopment/ApiDocs/Docs';
import { listCurrentUserProject } from '@/services/quiet/projectController';
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Cascader, Empty, Tabs, theme } from 'antd';
import React, { useEffect, useState } from 'react';

const ApiDocs: React.FC = () => {
  const { token } = theme.useToken();
  const [selectedProject, setSelectedProject] = useState<string>();
  const [userProjects, setUserProjects] = useState<API.UserProject[]>([]);

  useEffect(() => {
    listCurrentUserProject().then((resp) => setUserProjects(resp));
  }, []);

  return (
    <PageContainer title={false}>
      <Tabs
        defaultActiveKey="api"
        style={{
          backgroundColor: token.colorBgContainer,
          padding: token.paddingLG,
          paddingTop: 0,
        }}
        tabBarStyle={{ marginBottom: 5 }}
        tabBarExtraContent={
          <Cascader
            placeholder="请选择项目"
            expandTrigger="hover"
            allowClear={false}
            style={{ width: 300 }}
            fieldNames={{ label: 'name', value: 'id', children: 'projects' }}
            options={userProjects}
            onChange={(val) => {
              setSelectedProject(val[val?.length - 1]);
            }}
          />
        }
        items={[
          {
            key: 'api',
            icon: <FileTextOutlined />,
            label: '接口文档',
            children: selectedProject ? (
              <Docs projectId={selectedProject} />
            ) : (
              <Empty description={'请选择项目'} />
            ),
          },
          {
            key: 'setting',
            icon: <SettingOutlined />,
            label: '项目设置',
            children: '项目设置',
          },
        ]}
      />
    </PageContainer>
  );
};

export default ApiDocs;
