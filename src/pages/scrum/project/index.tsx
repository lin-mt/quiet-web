import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';
import { Form, Space, Typography } from 'antd';
import { OperationType } from '@/types/Type';
import { allMyProjects } from '@/services/scrum/ScrumProject';
import ProjectSetting from '@/pages/scrum/project/components/ProjectSetting';

const Project: React.FC<any> = () => {
  const addIconDefaultStyle = { fontSize: '36px' };

  const addIconOverStyle = {
    fontSize: '39px',
    color: '#1890ff',
  };
  const [form] = Form.useForm();
  const [settingForm] = Form.useForm();

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [projectFormOperationType, setProjectFormOperationType] = useState<OperationType>();
  const [cardProjects, setCardProjects] = useState<any[]>([]);
  const [updateInfo, setUpdateInfo] = useState<ScrumEntities.ScrumProject>();

  function loadAllMyProject() {
    allMyProjects().then((resp) => {
      let buildCardProject: React.SetStateAction<any[]> = [];
      buildCardProject.push({ key: 'newProjectKey' });
      buildCardProject = buildCardProject.concat(resp.managedProjects, resp.projects);
      const addEmptyProject = 5 - (buildCardProject.length % 5);
      for (let i = 0; i < addEmptyProject; i += 1) {
        buildCardProject.push({ key: `empty${i}` });
      }
      setCardProjects(buildCardProject);
    });
  }

  useEffect(() => {
    loadAllMyProject();
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
    loadAllMyProject();
  }

  function handleEditClick(project: ScrumEntities.ScrumProject) {
    form.setFieldsValue({
      ...project,
      manager: { value: project.manager, label: project.managerName },
      selectTeams: project.teams?.map((team) => {
        return { value: team.id, label: team.teamName };
      }),
    });
    setUpdateInfo(project);
    setProjectFormOperationType(OperationType.UPDATE);
    setProjectFormVisible(true);
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
                size={'small'}
                style={{ minHeight: '168' }}
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
                <ProjectSetting
                  key={'setting'}
                  projectInfo={project}
                  form={settingForm}
                  afterSettingUpdate={loadAllMyProject}
                />,
                <EditOutlined key={'edit'} onClick={() => handleEditClick(project)} />,
                <DeleteOutlined />,
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
          form={form}
          updateInfo={updateInfo}
          operationType={projectFormOperationType}
          onCancel={() => setProjectFormVisible(false)}
          afterAction={loadAllMyProject}
        />
      )}
    </>
  );
};

export default Project;
