import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { AppstoreAddOutlined } from '@ant-design/icons';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';
import { buildFullCard } from '@/utils/RenderUtils';
import ProjectCard from '@/pages/scrum/project/components/ProjectCard';
import type { ScrumProject } from '@/services/scrum/EntitiyType';

interface ProjectListProps {
  title: string;
  projects: ScrumProject[];
  projectNum?: number;
  newProject?: boolean;
  editable?: boolean;
  cardSize?: 'default' | 'small';
  afterUpdateAction?: () => void;
}

interface CardProjectInfo extends ScrumProject {
  key: string;
}

const ProjectList: React.FC<ProjectListProps> = (props) => {
  const {
    title,
    projects,
    projectNum = 5,
    newProject = false,
    editable = false,
    afterUpdateAction,
    cardSize,
  } = props;

  const addIconDefaultStyle = { fontSize: '36px' };

  const addIconOverStyle = {
    ...addIconDefaultStyle,
    color: '#1890ff',
  };
  const newProjectKey = 'newProjectKey';

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [cardProjects, setCardProjects] = useState<CardProjectInfo[]>([]);

  useEffect(() => {
    setCardProjects(buildFullCard(projects, projectNum, newProject, newProjectKey));
  }, [newProject, projectNum, projects]);

  function handleMouseOver() {
    setAddIconStyle(addIconOverStyle);
  }

  function handleMouseLeave() {
    setAddIconStyle(addIconDefaultStyle);
  }

  function handleNewProjectClick() {
    setProjectFormVisible(true);
  }

  return (
    <>
      <ProCard gutter={24} ghost style={{ marginBottom: '24px' }} title={title} collapsible>
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
            <ProCard key={project.id} hoverable={true} bodyStyle={{ padding: 0 }}>
              <ProjectCard
                project={project}
                cardSize={'small'}
                afterDeleteAction={afterUpdateAction}
                editable={editable}
              />
            </ProCard>
          ) : (
            <ProCard key={project.key} style={{ visibility: 'hidden' }} />
          );
        })}
      </ProCard>
      {projectFormVisible && (
        <ProjectForm
          visible={projectFormVisible}
          onCancel={() => setProjectFormVisible(false)}
          afterAction={afterUpdateAction}
        />
      )}
    </>
  );
};

export default ProjectList;
