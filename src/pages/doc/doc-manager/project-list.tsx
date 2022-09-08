import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  Grid,
  Modal,
  Space,
  Typography,
} from '@arco-design/web-react';
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-react/icon';
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

const { Row, Col } = Grid;

export type ProjectListProps = {
  groupId?: string;
};

function ProjectList(props: ProjectListProps) {
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
          style={{ textAlign: 'center' }}
          onClick={() => {
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
          }}
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

      {projects.map((value) => {
        return (
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={6}
            xxl={6}
            key={value.id}
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
                    {value.name.substring(0, 1)}
                  </Avatar>
                  <Typography.Text
                    style={{ marginBottom: 0 }}
                    ellipsis={{ cssEllipsis: true, rows: 2, showTooltip: true }}
                  >
                    {value.name}
                  </Typography.Text>
                </Space>
                <Space>
                  <span className={styles['icon-hover']}>
                    <IconEdit
                      onClick={() => {
                        setDocProjectFormProps({
                          visible: true,
                          project: value,
                          title: '更新项目',
                          onOk: (update) => {
                            return updateProject(update).then(() => {
                              listProject();
                              setDocProjectFormProps({ visible: false });
                            });
                          },
                          onCancel: () =>
                            setDocProjectFormProps({ visible: false }),
                        });
                      }}
                    />
                  </span>
                  <span className={styles['icon-delete']}>
                    <IconDelete
                      onClick={() => {
                        Modal.confirm({
                          title: `确定删除项目 ${value.name} 吗？`,
                          onConfirm: () =>
                            deleteProject(value.id).then(() => listProject()),
                        });
                      }}
                    />
                  </span>
                </Space>
                {
                  // TODO 收藏功能
                }
              </Space>
            </Card>
          </Col>
        );
      })}

      <DocProjectForm {...docProjectFormProps} />
    </Row>
  );
}

export default ProjectList;
