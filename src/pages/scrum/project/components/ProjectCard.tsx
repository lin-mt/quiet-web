import ProCard from '@ant-design/pro-card';
import { Link } from 'umi';
import { Button, Form, Popconfirm, Space, Typography } from 'antd';
import { DeleteFilled, EditFilled, ForwardFilled } from '@ant-design/icons';
import ProjectSetting from '@/pages/scrum/project/components/ProjectSetting';
import React, { useState } from 'react';
import { OperationType } from '@/types/Type';
import { deleteProject } from '@/services/scrum/ScrumProject';
import ProjectForm from '@/pages/scrum/project/components/ProjectForm';

type ProjectCardProps = {
  project: ScrumEntities.ScrumProject;
  cardSize?: 'default' | 'small';
  editable?: boolean;
  hoverable?: boolean;
  afterUpdateAction?: () => void;
};

const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  const { project, cardSize, editable = false, hoverable = false, afterUpdateAction } = props;

  const [form] = Form.useForm();
  const [settingForm] = Form.useForm();
  const [projectFormVisible, setProjectFormVisible] = useState<boolean>(false);
  const [projectFormOperationType, setProjectFormOperationType] = useState<OperationType>();
  const [updateInfo, setUpdateInfo] = useState<ScrumEntities.ScrumProject>();

  function handleEditClick(projectEdit: ScrumEntities.ScrumProject) {
    form.setFieldsValue({
      ...projectEdit,
      templateId: { value: projectEdit.templateId, label: projectEdit.templateName },
      manager: { value: projectEdit.manager, label: projectEdit.managerName },
      selectTeams: projectEdit.teams?.map((team) => {
        return { value: team.id, label: team.teamName };
      }),
    });
    setUpdateInfo(projectEdit);
    setProjectFormOperationType(OperationType.UPDATE);
    setProjectFormVisible(true);
  }

  async function handleDeleteClick(projectDelete: ScrumEntities.ScrumProject) {
    await deleteProject(projectDelete.id);
    if (afterUpdateAction) {
      afterUpdateAction();
    }
  }

  return (
    <>
      <ProCard
        style={{ height: '100%' }}
        hoverable={hoverable}
        key={project.id}
        title={project.name}
        size={cardSize}
        extra={
          <Link to={`/scrum/project/detail/?projectId=${project.id}`}>
            <Button icon={<ForwardFilled />} type={'primary'} shape={'round'} size={'small'} />
          </Link>
        }
        actions={
          !editable
            ? undefined
            : [
                <ProjectSetting
                  key={'setting'}
                  projectInfo={project}
                  form={settingForm}
                  afterSettingUpdate={afterUpdateAction}
                />,
                <EditFilled key={'edit'} onClick={() => handleEditClick(project)} />,
                <Popconfirm
                  placement={'bottom'}
                  title={`确定删除项目 ${project.name} 吗?`}
                  onConfirm={() => handleDeleteClick(project)}
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
          <Typography.Text style={{ color: '#108EE9' }}>{project.managerName}</Typography.Text>
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

export default ProjectCard;
