import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { AppstoreAddOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';
import { Form, Popconfirm, Space, Typography } from 'antd';
import { OperationType } from '@/types/Type';
import ProjectSetting from '@/pages/scrum/project/components/ProjectSetting';
import style from '@/pages/scrum/project/components/Components.less';
import { deleteProject } from '@/services/scrum/ScrumProject';

type ProjectListProps = {
  title: string;
  projects: ScrumEntities.ScrumProject[];
  projectNum?: number;
  newProject?: boolean;
  canSetting?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  cardSize?: 'default' | 'small';
  afterUpdateAction?: () => void;
};

type CardProjectInfo = ScrumEntities.ScrumProject & {
  key: string;
};

const ProjectList: React.FC<ProjectListProps> = (props) => {
  const {
    title,
    projects,
    projectNum = 5,
    newProject = false,
    canSetting = false,
    canEdit = false,
    canDelete = false,
    afterUpdateAction,
    cardSize,
  } = props;

  const addIconDefaultStyle = { fontSize: '36px' };

  const addIconOverStyle = {
    ...addIconDefaultStyle,
    color: '#1890ff',
  };
  const newProjectKey = 'newProjectKey';
  const [form] = Form.useForm();
  const [settingForm] = Form.useForm();

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [projectFormOperationType, setProjectFormOperationType] = useState<OperationType>();
  const [cardProjects, setCardProjects] = useState<CardProjectInfo[]>([]);
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

  async function handleDeleteClick(project: CardProjectInfo) {
    await deleteProject(project.id);
    if (afterUpdateAction) {
      afterUpdateAction();
    }
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
              className={!(canSetting || canEdit || canDelete) && style.hideProCardActions}
              actions={[
                canSetting && (
                  <ProjectSetting
                    key={'setting'}
                    projectInfo={project}
                    form={settingForm}
                    afterSettingUpdate={afterUpdateAction}
                  />
                ),
                canEdit && <EditFilled key={'edit'} onClick={() => handleEditClick(project)} />,
                canDelete && (
                  <Popconfirm
                    placement={'bottom'}
                    title={`确定删除项目 ${project.name} 吗?`}
                    onConfirm={() => handleDeleteClick(project)}
                  >
                    <DeleteFilled key={'delete'} />
                  </Popconfirm>
                ),
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
                    tooltip: project.description,
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
