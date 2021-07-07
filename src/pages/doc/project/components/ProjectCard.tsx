import ProCard from '@ant-design/pro-card';
import { Link } from 'umi';
import { Button, Popconfirm, Space, Typography } from 'antd';
import { DeleteFilled, EditFilled, ForwardFilled } from '@ant-design/icons';
import React, { useState } from 'react';
import { deleteProject, findProjectInfo } from '@/services/doc/DocProject';
import ProjectForm from '@/pages/doc/project/components/ProjectForm';
import type { DocProject } from '@/services/doc/EntityType';

interface ProjectCardProps {
  project: DocProject;
  cardSize?: 'default' | 'small';
  editable?: boolean;
  afterDeleteAction?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  const { project, cardSize, editable = false, afterDeleteAction } = props;

  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [projectInfo, setProjectInfo] = useState<DocProject>(project);

  async function handleEditClick() {
    setProjectFormVisible(true);
    await reloadProjectInfo();
  }

  async function reloadProjectInfo() {
    setProjectInfo(await findProjectInfo(projectInfo.id));
  }

  async function handleDeleteClick() {
    await deleteProject(projectInfo.id);
    if (afterDeleteAction) {
      afterDeleteAction();
    }
  }

  return (
    <>
      <ProCard
        style={{ height: '100%' }}
        key={projectInfo.id}
        title={projectInfo.name}
        size={cardSize}
        extra={
          <Link to={`/scrum/project/detail?projectId=${projectInfo.id}`}>
            <Button icon={<ForwardFilled />} type={'primary'} shape={'round'} size={'small'} />
          </Link>
        }
        actions={
          !editable
            ? undefined
            : [
                <EditFilled key={'edit'} onClick={handleEditClick} />,
                <Popconfirm
                  placement={'bottom'}
                  title={`确定删除项目 ${projectInfo.name} 吗?`}
                  onConfirm={handleDeleteClick}
                >
                  <DeleteFilled
                    key={'delete'}
                    onMouseOver={(event) => {
                      // eslint-disable-next-line no-param-reassign
                      event.currentTarget.style.color = 'red';
                    }}
                    onMouseLeave={(event) => {
                      // eslint-disable-next-line no-param-reassign
                      event.currentTarget.style.color = 'rgba(0, 0, 0, 0.45)';
                    }}
                  />
                </Popconfirm>,
              ]
        }
      >
        <Space direction={'vertical'}>
          <Typography.Text style={{ color: '#108EE9' }}>
            {projectInfo.principalName}
          </Typography.Text>
          <Typography.Paragraph
            type={'secondary'}
            ellipsis={{
              rows: 1,
              tooltip: projectInfo.remark,
            }}
          >
            {projectInfo.remark}
          </Typography.Paragraph>
        </Space>
      </ProCard>
      {projectFormVisible && (
        <ProjectForm
          visible={projectFormVisible}
          updateInfo={projectInfo}
          onCancel={() => setProjectFormVisible(false)}
          afterAction={reloadProjectInfo}
        />
      )}
    </>
  );
};

export default ProjectCard;
