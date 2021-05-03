import ProCard from '@ant-design/pro-card';
import { Link } from 'umi';
import { Button, Form, Popconfirm, Space, Typography } from 'antd';
import { DeleteFilled, EditFilled, ForwardFilled } from '@ant-design/icons';
import ProjectSetting from '@/pages/scrum/project/components/ProjectSetting';
import React, { useState } from 'react';
import { deleteProject, findProjectInfo } from '@/services/scrum/ScrumProject';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';
import type { ScrumProject } from '@/services/scrum/EntitiyType';

interface ProjectCardProps {
  project: ScrumProject;
  cardSize?: 'default' | 'small';
  editable?: boolean;
  afterDeleteAction?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  const { project, cardSize, editable = false, afterDeleteAction } = props;

  const [settingForm] = Form.useForm();
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [projectInfo, setProjectInfo] = useState<ScrumProject>(project);

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
          <Link to={`/scrum/project/detail/?projectId=${projectInfo.id}`}>
            <Button icon={<ForwardFilled />} type={'primary'} shape={'round'} size={'small'} />
          </Link>
        }
        actions={
          !editable
            ? undefined
            : [
                <ProjectSetting
                  key={'setting'}
                  projectInfo={projectInfo}
                  form={settingForm}
                  afterSettingUpdate={reloadProjectInfo}
                />,
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
          <Typography.Text style={{ color: '#108EE9' }}>{projectInfo.managerName}</Typography.Text>
          <Typography.Paragraph
            type={'secondary'}
            ellipsis={{
              rows: 1,
              tooltip: projectInfo.description,
            }}
          >
            {projectInfo.description}
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
