import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { AppstoreAddOutlined } from '@ant-design/icons';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';
import ProjectCard from '@/pages/scrum/project/components/ProjectCard';
import type { ScrumProject } from '@/services/scrum/EntitiyType';

interface ProjectListProps {
  title: string;
  projects: ScrumProject[];
  newProject?: boolean;
  editable?: boolean;
  cardSize?: 'default' | 'small';
  afterAction?: () => void;
}

const ProjectList: React.FC<ProjectListProps> = (props) => {
  const { title, projects, newProject = false, editable = false, afterAction, cardSize } = props;

  const addIconDefaultStyle = { fontSize: '36px' };

  const addIconOverStyle = {
    ...addIconDefaultStyle,
    fontSize: '39px',
    color: '#1890ff',
  };
  const newProjectKey = 'newProjectKey';

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [cardProjects, setCardProjects] = useState<ScrumProject[]>([]);

  useEffect(() => {
    if (newProject) {
      const newProjectCard: any = { id: newProjectKey };
      projects.unshift(newProjectCard);
    }
    setCardProjects(projects);
  }, [newProject, projects]);

  function handleMouseOver() {
    setAddIconStyle(addIconOverStyle);
  }

  function handleMouseLeave() {
    setAddIconStyle(addIconDefaultStyle);
  }

  function handleNewProjectClick() {
    setProjectFormVisible(true);
  }

  const cardHeight = 168;
  const colSpan = '20%';

  return (
    <>
      <ProCard
        wrap={true}
        collapsible={true}
        ghost={true}
        gutter={[16, 16]}
        style={{ marginBottom: 24 }}
        title={title}
      >
        {cardProjects.map((project) => {
          if (project.id === newProjectKey) {
            return (
              <ProCard
                key={project.id}
                colSpan={colSpan}
                layout={'center'}
                hoverable={true}
                size={cardSize}
                style={{ height: cardHeight }}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                onClick={handleNewProjectClick}
              >
                <AppstoreAddOutlined style={addIconStyle} />
              </ProCard>
            );
          }
          return (
            <ProCard
              key={project.id}
              hoverable={true}
              colSpan={colSpan}
              bodyStyle={{ padding: 0, height: cardHeight }}
            >
              <ProjectCard
                project={project}
                cardSize={'small'}
                afterDeleteAction={afterAction}
                editable={editable}
              />
            </ProCard>
          );
        })}
      </ProCard>
      {projectFormVisible && (
        <ProjectForm
          visible={projectFormVisible}
          onCancel={() => setProjectFormVisible(false)}
          afterAction={afterAction}
        />
      )}
    </>
  );
};

export default ProjectList;
