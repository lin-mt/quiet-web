import { Button, Card, Descriptions, Empty, Form, Popover, Space, Spin, Tree } from 'antd';
import type { Key } from 'react';
import { useEffect, useState } from 'react';
import { findDetailsByProjectId } from '@/services/scrum/ScrumVersion';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import VersionForm from '@/pages/scrum/project/detail/components/VersionForm';
import moment from 'moment';
import { iterationsAddToChildren } from '@/utils/scrum/utils';

type PlanningIterationProps = {
  projectId: string;
};

export default (props: PlanningIterationProps) => {
  const { projectId } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [versionFormVisible, setVersionFormVisible] = useState<boolean>(false);
  const [parentVersionId, setParentVersionId] = useState<string>();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>();
  const [versions, setVersions] = useState<ScrumEntities.ScrumVersion[]>([]);
  const [updateVersionInfo, setUpdateVersionInfo] = useState<ScrumEntities.ScrumVersion>();
  const [versionForm] = Form.useForm();

  function reloadVersions() {
    setLoading(true);
    findDetailsByProjectId(projectId).then((projectVersions) => {
      setVersions(iterationsAddToChildren(projectVersions));
      setLoading(false);
    });
  }

  useEffect(() => {
    setLoading(true);
    findDetailsByProjectId(projectId).then((projectVersions) => {
      setVersions(iterationsAddToChildren(projectVersions));
      setLoading(false);
    });
  }, [projectId]);

  return (
    <>
      <Card
        title={'规划迭代'}
        size={'small'}
        extra={
          <div>
            <Button
              type={'primary'}
              size={'small'}
              shape={'round'}
              icon={<PlusOutlined />}
              onClick={() => setVersionFormVisible(true)}
            >
              新建版本
            </Button>
          </div>
        }
      >
        {loading || versions.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '16px',
              color: 'rgba(0, 0, 0, 0.25)',
              fontSize: '14px',
            }}
          >
            {loading ? (
              <Spin />
            ) : (
              <Empty>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setVersionFormVisible(true)}
                >
                  新建版本
                </Button>
              </Empty>
            )}
          </div>
        ) : (
          <Tree
            treeData={versions}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys)}
            titleRender={(node) => {
              return (
                <Popover
                  title={null}
                  placement={'right'}
                  trigger={'click'}
                  content={
                    <Descriptions
                      column={1}
                      size={'small'}
                      style={{ width: '300px', fontSize: '12px' }}
                    >
                      <Descriptions.Item label="备注">
                        {
                          // @ts-ignore
                          node.remark
                        }
                      </Descriptions.Item>
                      <Descriptions.Item label="计划开始日期">
                        {
                          // @ts-ignore
                          node.planStartDate
                        }
                      </Descriptions.Item>
                      <Descriptions.Item label="计划开始日期">
                        {
                          // @ts-ignore
                          node.planEndDate
                        }
                      </Descriptions.Item>
                      <Descriptions.Item>
                        <Space>
                          <Button
                            size={'small'}
                            type={'primary'}
                            icon={<EditOutlined />}
                            onClick={() => {
                              // @ts-ignore
                              setParentVersionId(node.parentId);
                              setUpdateVersionInfo(node);
                              // @ts-ignore
                              versionForm.setFieldsValue({
                                ...node,
                                // @ts-ignore
                                planStartDate: moment(node.planStartDate, 'YYYY-MM-DD'),
                                // @ts-ignore
                                planEndDate: moment(node.planEndDate, 'YYYY-MM-DD'),
                              });
                              setVersionFormVisible(true);
                            }}
                          >
                            修改
                          </Button>
                          <Button
                            size={'small'}
                            type={'primary'}
                            // @ts-ignore
                            disabled={node.iteration && node.iteration.length > 0}
                            icon={<PlusOutlined />}
                            onClick={() => {
                              // @ts-ignore
                              setParentVersionId(node.id);
                              setVersionFormVisible(true);
                            }}
                          >
                            子版本
                          </Button>
                          <Button
                            size={'small'}
                            type={'primary'}
                            disabled={node.children && node.children.length > 0}
                            icon={<PlusOutlined />}
                          >
                            迭代
                          </Button>
                        </Space>
                      </Descriptions.Item>
                    </Descriptions>
                  }
                >
                  {
                    // @ts-ignore
                    node.versionId ? null : 'v'
                  }
                  {
                    // @ts-ignore
                    node.name
                  }
                </Popover>
              );
            }}
          />
        )}
      </Card>
      {versionFormVisible && (
        <VersionForm
          form={versionForm}
          projectId={projectId}
          parentId={parentVersionId}
          updateInfo={updateVersionInfo}
          visible={versionFormVisible}
          afterAction={reloadVersions}
          onCancel={() => {
            setVersionFormVisible(false);
            setParentVersionId(undefined);
            setUpdateVersionInfo(undefined);
          }}
        />
      )}
    </>
  );
};
