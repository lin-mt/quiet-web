import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  Grid,
  Modal,
  Space,
  Tooltip,
  Typography,
} from '@arco-design/web-react';
import {
  IconDelete,
  IconEdit,
  IconList,
  IconPlus,
  IconStar,
} from '@arco-design/web-react/icon';
import NProgress from 'nprogress';
import styles from './style/index.module.less';
import { DocProject } from '@/service/doc/type';
import {
  deleteProject,
  listAllProjectByGroupId,
  saveProject,
  updateProject,
} from '@/service/doc/project';
import DocProjectForm, {
  DocProjectFormProps,
} from '@/components/doc/ProjectForm';
import { useHistory } from 'react-router';

const { Row, Col } = Grid;

export type ProjectGroupProjectProps = {
  groupId?: string;
};

function ProjectGroupProject(props: ProjectGroupProjectProps) {
  const history = useHistory();
  const [projects, setProjects] = useState<DocProject[]>([]);
  const [docProjectFormProps, setDocProjectFormProps] =
    useState<DocProjectFormProps>({});

  useEffect(() => {
    listProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.groupId]);

  function listProject() {
    listAllProjectByGroupId(props.groupId).then((resp) => {
      setProjects(resp);
    });
  }

  function handleEditorProject(value: DocProject) {
    setDocProjectFormProps({
      visible: true,
      formValues: value,
      title: '更新项目',
      onOk: (update) => {
        return updateProject(update).then(() => {
          listProject();
          setDocProjectFormProps({ visible: false });
        });
      },
      onCancel: () => setDocProjectFormProps({ visible: false }),
    });
  }

  function handleNewProjectClick() {
    setDocProjectFormProps({
      visible: true,
      title: '新建项目',
      onOk: (value) => {
        value.group_id = props.groupId;
        return saveProject(value).then(() => {
          listProject();
          setDocProjectFormProps({ visible: false });
        });
      },
      onCancel: () => setDocProjectFormProps({ visible: false }),
    });
  }

  function handleDeleteProject(value: DocProject) {
    Modal.confirm({
      title: `确定删除项目 ${value.name} 吗？`,
      onConfirm: () => deleteProject(value.id).then(() => listProject()),
    });
  }

  return (
    <Row gutter={20} className={styles['project-list']}>
      <Col
        xs={24}
        sm={12}
        md={8}
        lg={6}
        xl={6}
        xxl={6}
        key={'add-project'}
        style={{ marginBottom: 15 }}
      >
        <Card
          hoverable
          bordered
          className={styles['card-with-icon-hover']}
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={() => handleNewProjectClick()}
        >
          <Space
            style={{
              height: 44,
              justifyContent: 'space-between',
            }}
          >
            <Space>
              <IconPlus />
              <Typography.Text
                style={{ color: 'var(--color-text-3)', fontWeight: 400 }}
              >
                新建项目
              </Typography.Text>
            </Space>
          </Space>
        </Card>
      </Col>

      {projects.map((project) => {
        return (
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={6}
            xxl={6}
            key={project.id}
            style={{ marginBottom: 15 }}
          >
            <Card hoverable bordered className={styles['card-with-icon-hover']}>
              <Space
                style={{
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Space>
                  <Avatar
                    style={{
                      backgroundColor: 'rgb(var(--arcoblue-6))',
                    }}
                    size={28}
                  >
                    {project.name.substring(0, 1)}
                  </Avatar>
                  <Typography.Text
                    style={{ marginBottom: 0 }}
                    ellipsis={{ cssEllipsis: true, rows: 2, showTooltip: true }}
                  >
                    {project.name}
                  </Typography.Text>
                </Space>
                <Space>
                  <Space direction={'vertical'}>
                    <span className={styles['icon-hover']}>
                      <Tooltip content={'接口列表'}>
                        <IconList
                          onClick={() => {
                            NProgress.start();
                            history.push(
                              `/doc/api-manager?project_id=${project.id}${
                                project.group_id
                                  ? '&group_id=' + project.group_id
                                  : ''
                              }`
                            );
                            NProgress.done();
                          }}
                        />
                      </Tooltip>
                    </span>
                    <span className={styles['icon-disable']}>
                      <Tooltip content={''} position={'bottom'}>
                        <IconStar />
                      </Tooltip>
                    </span>
                  </Space>
                  <Space direction={'vertical'}>
                    <span className={styles['icon-hover']}>
                      <Tooltip content={'编辑项目'}>
                        <IconEdit
                          onClick={() => handleEditorProject(project)}
                        />
                      </Tooltip>
                    </span>
                    <span className={styles['icon-delete']}>
                      <Tooltip content={'删除项目'} position={'bottom'}>
                        <IconDelete
                          onClick={() => handleDeleteProject(project)}
                        />
                      </Tooltip>
                    </span>
                  </Space>
                </Space>
              </Space>
            </Card>
          </Col>
        );
      })}

      <DocProjectForm {...docProjectFormProps} />
    </Row>
  );
}

export default ProjectGroupProject;
