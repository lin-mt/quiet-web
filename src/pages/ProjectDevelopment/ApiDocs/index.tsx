import Docs from '@/pages/ProjectDevelopment/ApiDocs/Docs';
import { listCurrentUserProject } from '@/services/quiet/projectController';
import { listCurrentUserProjectGroup } from '@/services/quiet/projectGroupController';
import { IdName } from '@/util/Utils';
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Empty, Form, Select, Tabs, theme } from 'antd';
import React, { useEffect, useState } from 'react';

type SelectedProject = {
  groupId: string;
  projectId?: string;
};

const ApiDocs: React.FC = () => {
  const { token } = theme.useToken();
  const [projectGroups, setProjectGroups] = useState<API.SimpleProjectGroup[]>();
  const [selectedProject, setSelectedProject] = useState<SelectedProject>();
  const [projects, setProjects] = useState<API.SimpleProject[]>();

  useEffect(() => {
    listCurrentUserProjectGroup().then((resp) => {
      setProjectGroups(resp);
    });
  }, []);

  return (
    <PageContainer title={false}>
      <Tabs
        defaultActiveKey="api"
        style={{ backgroundColor: token.colorBgContainer, padding: token.paddingLG, paddingTop: 0 }}
        tabBarExtraContent={
          <Form layout="inline">
            <Form.Item style={{ width: 300 }} name={'projectGroupId'} label={'项目组'}>
              <Select
                placeholder="请选择项目组"
                options={projectGroups}
                fieldNames={IdName}
                onChange={(val) => {
                  setSelectedProject({ groupId: val });
                  listCurrentUserProject({ projectGroupId: val }).then((resp) => {
                    setProjects(resp);
                  });
                }}
              />
            </Form.Item>
            <Form.Item style={{ width: 300 }} name={'projectId'} label={'项目'}>
              <Select
                placeholder="请选择项目"
                options={projects}
                fieldNames={IdName}
                onChange={(val) => {
                  if (selectedProject) {
                    setSelectedProject({
                      ...selectedProject,
                      projectId: val,
                    });
                  }
                }}
                notFoundContent={
                  <Empty
                    description={
                      selectedProject?.groupId ? '该项目组下暂无项目信息' : '请选择项目组'
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                }
              />
            </Form.Item>
          </Form>
        }
        items={[
          {
            key: 'api',
            icon: <FileTextOutlined />,
            label: '接口文档',
            children: selectedProject?.projectId ? (
              <Docs projectId={selectedProject?.projectId} />
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
