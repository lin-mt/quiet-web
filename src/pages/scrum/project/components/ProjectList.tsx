import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';
import { Form, Space, Typography } from 'antd';
import { OperationType } from '@/types/Type';
import ProjectSetting from '@/pages/scrum/project/components/ProjectSetting';
import style from './Components.less';

type ProjectListProps = {
  title: string;
  projects: ScrumEntities.ScrumProject[];
  projectNum?: number;
  newProject?: boolean;
  settingProject?: boolean;
  editProject?: boolean;
  deleteProject?: boolean;
  cardSize?: 'default' | 'small';
  afterUpdateAction?: () => void;
};

const ProjectList: React.FC<ProjectListProps> = (props) => {
  const {
    title,
    projects,
    projectNum = 5,
    newProject = false,
    settingProject = false,
    editProject = false,
    deleteProject = false,
    afterUpdateAction,
    cardSize,
  } = props;

  const addIconDefaultStyle = { fontSize: '36px' };

  const addIconOverStyle = {
    fontSize: '39px',
    color: '#1890ff',
  };
  const newProjectKey = 'newProjectKey';
  const [form] = Form.useForm();
  const [settingForm] = Form.useForm();

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [projectFormOperationType, setProjectFormOperationType] = useState<OperationType>();
  const [cardProjects, setCardProjects] = useState<any[]>([]);
  const [updateInfo, setUpdateInfo] = useState<ScrumEntities.ScrumProject>();

  useEffect(() => {
    let buildCardProject: React.SetStateAction<any[]> = [];
    if (newProject) {
      buildCardProject.push({ key: newProjectKey });
    }
    buildCardProject = buildCardProject.concat(projects);
    const addEmptyProject = projectNum - (buildCardProject.length % projectNum);
    for (let i = 0; i < addEmptyProject; i += 1) {
      buildCardProject.push({ key: `empty${i}` });
    }
    setCardProjects(buildCardProject);
  }, [newProject, projectNum, projects]);

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
      <ProCard gutter={24} ghost style={{ marginBottom: '24px' }} title={title}>
        {cardProjects.map((project) => {
          if (project.key === newProjectKey) {
            return (
              <ProCard
                key={project.key}
                layout={'center'}
                hoverable={true}
                size={cardSize}
                style={{ minHeight: '168px' }}
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
              size={cardSize}
              className={
                !(settingProject || editProject || deleteProject) && style.hideProCardActions
              }
              actions={[
                settingProject && (
                  <ProjectSetting
                    key={'setting'}
                    projectInfo={project}
                    form={settingForm}
                    afterSettingUpdate={afterUpdateAction}
                  />
                ),
                editProject && (
                  <EditOutlined key={'edit'} onClick={() => handleEditClick(project)} />
                ),
                deleteProject && <DeleteOutlined key={'delete'} />,
              ]}
            >
              <Space direction={'vertical'}>
                <Typography.Text style={{ color: '#108EE9' }}>
                  {project.managerName}
                </Typography.Text>
                <Typography.Paragraph
                  type={'secondary'}
                  ellipsis={{
                    rows: 1,
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
          afterAction={afterUpdateAction}
        />
      )}
    </>
  );
};

export default ProjectList;
