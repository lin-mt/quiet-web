import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import {
  AppstoreAddOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';
import { Form, Space, Typography } from 'antd';
import { OperationType } from '@/types/Type';
import { allMyProjects } from '@/services/scrum/ScrumProject';

const Project: React.FC<any> = () => {
  const addIconDefaultStyle = { fontSize: '36px' };

  const addIconOverStyle = {
    fontSize: '39px',
    color: '#1890ff',
  };
  const [projectForm] = Form.useForm();

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [projectFormOperationType, setProjectFormOperationType] = useState<OperationType>();
  const [cardProjects, setCardProjects] = useState<any[]>([]);

  useEffect(() => {
    allMyProjects().then((resp) => {
      let buildCardProject: React.SetStateAction<any[]> = [];
      buildCardProject = buildCardProject.concat(resp.managedProjects, resp.projects);
      buildCardProject.unshift({ key: 'empty' });
      const addEmptyProject = 5 - (buildCardProject.length % 5);
      for (let i = 0; i < addEmptyProject; i += 1) {
        buildCardProject.push({ key: `empty${i}` });
      }
      setCardProjects(buildCardProject);
    });
  }, []);

  function handleMouseOver() {
    setAddIconStyle(addIconOverStyle);
  }

  function handleMouseLeave() {
    setAddIconStyle(addIconDefaultStyle);
  }

  function handleNewProjectClick() {
    setProjectFormVisible(true);
    setProjectFormOperationType(OperationType.CREATE);
  }

  return (
    <>
      <ProCard gutter={24} ghost style={{ marginBottom: '24px' }}>
        {cardProjects.map((project, index) => {
          if (index === 0) {
            return (
              <ProCard
                key={project.key}
                layout={'center'}
                hoverable={true}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                onClick={handleNewProjectClick}
              >
                <AppstoreAddOutlined style={addIconStyle} />
              </ProCard>
            );
          }
          return project.id ? (
            <ProCard
              hoverable={true}
              key={project.id}
              title={project.name}
              size={'small'}
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Space direction={'vertical'}>
                <Typography.Text style={{ color: '#108EE9' }}>
                  {project.managerName}
                </Typography.Text>
                <Typography.Paragraph
                  type={'secondary'}
                  ellipsis={{
                    rows: 2,
                  }}
                >
                  {project.description}
                </Typography.Paragraph>
              </Space>
            </ProCard>
          ) : (
            <ProCard key={project.key} style={{ backgroundColor: '#f0f2f5' }} />
          );
        })}
      </ProCard>
      {projectFormVisible && (
        <ProjectForm
          visible={projectFormVisible}
          form={projectForm}
          operationType={projectFormOperationType}
          onCancel={() => setProjectFormVisible(false)}
        />
      )}
    </>
  );
};

export default Project;
