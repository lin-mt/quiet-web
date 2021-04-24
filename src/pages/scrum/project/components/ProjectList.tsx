import type { CSSProperties } from 'react';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { OperationType } from '@/types/Type';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';
import { buildFullCard } from '@/utils/utils';
import ProjectCard from '@/pages/scrum/project/components/ProjectCard';

type ProjectListProps = {
  title: string;
  projects: ScrumEntities.ScrumProject[];
  projectNum?: number;
  newProject?: boolean;
  editable?: boolean;
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
  const [form] = Form.useForm();

  const [addIconStyle, setAddIconStyle] = useState<CSSProperties>(addIconDefaultStyle);
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [projectFormOperationType, setProjectFormOperationType] = useState<OperationType>();
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
    setProjectFormOperationType(OperationType.CREATE);
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
            <ProCard key={project.key} style={{ backgroundColor: '#f0f2f5' }} />
          );
        })}
      </ProCard>
      {projectFormVisible && (
        <ProjectForm
          visible={projectFormVisible}
          form={form}
          operationType={projectFormOperationType}
          onCancel={() => setProjectFormVisible(false)}
          afterAction={afterUpdateAction}
        />
      )}
    </>
  );
};

export default ProjectList;
