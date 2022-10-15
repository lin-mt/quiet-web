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
  IconPlus,
  IconSelectAll,
  IconStar,
} from '@arco-design/web-react/icon';
import NProgress from 'nprogress';
import styles from './style/index.module.less';
import { ScrumProject } from '@/service/scrum/type';
import ScrumProjectForm, {
  ScrumProjectFormProps,
} from '@/components/scrum/ProjectForm';
import {
  deleteProject,
  listProject,
  saveProject,
  updateProject,
} from '@/service/scrum/project';
import { useHistory } from 'react-router';

const { Row, Col } = Grid;

export type ProjectGroupProjectProps = {
  groupId?: string;
};

function ProjectList(props: ProjectGroupProjectProps) {
  const history = useHistory();
  const [projects, setProjects] = useState<ScrumProject[]>([]);
  const [scrumProjectFormProps, setScrumProjectFormProps] =
    useState<ScrumProjectFormProps>({});

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.groupId]);

  function loadData() {
    listProject(props.groupId).then((resp) => {
      setProjects(resp);
    });
  }

  function handleEditorProject(value: ScrumProject) {
    setScrumProjectFormProps({
      visible: true,
      formValues: value,
      title: '更新项目',
      onOk: (update) => {
        return updateProject(update).then(() => {
          loadData();
          setScrumProjectFormProps({ visible: false });
        });
      },
      onCancel: () => setScrumProjectFormProps({ visible: false }),
    });
  }

  function handleNewProjectClick() {
    setScrumProjectFormProps({
      visible: true,
      title: '新建项目',
      onOk: (value) => {
        value.group_id = props.groupId;
        return saveProject(value).then(() => {
          loadData();
          setScrumProjectFormProps({ visible: false });
        });
      },
      onCancel: () => setScrumProjectFormProps({ visible: false }),
    });
  }

  function handleDeleteProject(value: ScrumProject) {
    Modal.confirm({
      title: `确定删除项目 ${value.name} 吗？`,
      onConfirm: () => deleteProject(value.id).then(() => loadData()),
    });
  }

  return (
    <Card>
      <Row gutter={20} className={styles['scrum-project-list']}>
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
              <IconPlus />
              <Typography.Text
                style={{ color: 'var(--color-text-3)', fontWeight: 400 }}
              >
                新建项目
              </Typography.Text>
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
              <Card
                hoverable
                bordered
                className={styles['card-with-icon-hover']}
              >
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
                      ellipsis={{
                        cssEllipsis: true,
                        rows: 2,
                        showTooltip: true,
                      }}
                    >
                      {project.name}
                    </Typography.Text>
                  </Space>
                  <Space>
                    <Space direction={'vertical'}>
                      <span className={styles['icon-hover']}>
                        <Tooltip content={'版本规划'}>
                          <IconSelectAll
                            onClick={() => {
                              NProgress.start();
                              let url = `/scrum/version-planning?projectId=${project.id}`;
                              if (project.group_id) {
                                url = url + `&groupId=${project.group_id}`;
                              }
                              history.push(url);
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

        <ScrumProjectForm {...scrumProjectFormProps} />
      </Row>
    </Card>
  );
}

export default ProjectList;
