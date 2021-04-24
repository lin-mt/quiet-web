import ProCard from '@ant-design/pro-card';
import { Link } from 'umi';
import { Button, Form, Popconfirm, Space, Typography } from 'antd';
import { DeleteFilled, EditFilled, ForwardFilled } from '@ant-design/icons';
import ProjectSetting from '@/pages/scrum/project/components/ProjectSetting';
import React, { useState } from 'react';
import { OperationType } from '@/types/Type';
import { deleteProject, projectDetailInfo } from '@/services/scrum/ScrumProject';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';

type ProjectCardProps = {
  project: ScrumEntities.ScrumProject;
  cardSize?: 'default' | 'small';
  editable?: boolean;
  afterDeleteAction?: () => void;
};

const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  const { project, cardSize, editable = false, afterDeleteAction } = props;

  const [projectForm] = Form.useForm();
  const [settingForm] = Form.useForm();
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [projectFormOperationType, setProjectFormOperationType] = useState<OperationType>();
  const [projectInfo, setProjectInfo] = useState<ScrumEntities.ScrumProject>(project);

  async function handleEditClick() {
    projectForm.setFieldsValue({
      ...projectInfo,
      templateId: { value: projectInfo.templateId, label: projectInfo.templateName },
      manager: { value: projectInfo.manager, label: projectInfo.managerName },
      selectTeams: projectInfo.teams?.map((team) => {
        return { value: team.id, label: team.teamName };
      }),
    });
    setProjectFormOperationType(OperationType.UPDATE);
    setProjectFormVisible(true);
    await reloadProjectInfo();
  }

  async function reloadProjectInfo() {
    setProjectInfo(await projectDetailInfo(projectInfo.id));
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
          form={projectForm}
          updateInfo={projectInfo}
          operationType={projectFormOperationType}
          onCancel={() => setProjectFormVisible(false)}
          afterAction={reloadProjectInfo}
        />
      )}
    </>
  );
};

export default ProjectCard;
