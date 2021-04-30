import { Button, Card, Descriptions, Empty, Form, Popover, Space, Spin, Tree } from 'antd';
import type { Key } from 'react';
import { useEffect, useState } from 'react';
import { findDetailsByProjectId } from '@/services/scrum/ScrumVersion';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import VersionForm from '@/pages/scrum/project/detail/components/VersionForm';
import moment from 'moment';
import { iterationsAddToChildren } from '@/utils/scrum/utils';
import IterationForm from '@/pages/scrum/project/detail/components/IterationForm';

type PlanningIterationProps = {
  projectId: string;
};

export default (props: PlanningIterationProps) => {
  const { projectId } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [versionFormVisible, setVersionFormVisible] = useState<boolean>(false);
  const [iterationFormVisible, setIterationFormVisible] = useState<boolean>(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string>();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>();
  const [versions, setVersions] = useState<ScrumEntities.ScrumVersion[]>([]);
  const [updateVersionInfo, setUpdateVersionInfo] = useState<ScrumEntities.ScrumVersion>();
  const [updateIterationInfo, setUpdateIterationInfo] = useState<ScrumEntities.ScrumIteration>();
  const [versionForm] = Form.useForm();
  const [iterationForm] = Form.useForm();

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
              onClick={() => {
                setSelectedVersionId(undefined);
                setVersionFormVisible(true);
              }}
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
            // @ts-ignore
            onClick={(e, node) => setSelectedVersionId(node.id)}
            titleRender={(node) => {
              // @ts-ignore
              const isVersionNode = !node.versionId;
              const showAddVersion =
                isVersionNode &&
                // @ts-ignore
                (!node.children || !node.iterations || node.iterations.length === 0);
              const showAddIteration =
                isVersionNode &&
                (!node.children ||
                  node.children.length === 0 ||
                  // @ts-ignore
                  (node.iterations && node.iterations.length > 0));
              return (
                <Popover
                  title={null}
                  placement={'bottom'}
                  trigger={'click'}
                  content={
                    <Descriptions column={1} size={'small'} style={{ width: '360px' }}>
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
                              const selectedNodeValues = {
                                ...node,
                                // @ts-ignore
                                planStartDate: moment(node.planStartDate, 'YYYY-MM-DD'),
                                // @ts-ignore
                                planEndDate: moment(node.planEndDate, 'YYYY-MM-DD'),
                              };
                              if (isVersionNode) {
                                versionForm.setFieldsValue(selectedNodeValues);
                                setUpdateVersionInfo(node);
                                setVersionFormVisible(true);
                              } else {
                                iterationForm.setFieldsValue(selectedNodeValues);
                                // @ts-ignore
                                setSelectedVersionId(node.id);
                                // @ts-ignore
                                setUpdateIterationInfo(node);
                                setIterationFormVisible(true);
                              }
                            }}
                          >
                            修改
                          </Button>
                          {showAddVersion && (
                            <Button
                              size={'small'}
                              type={'primary'}
                              icon={<PlusOutlined />}
                              onClick={() => setVersionFormVisible(true)}
                            >
                              子版本
                            </Button>
                          )}
                          {showAddIteration && (
                            <Button
                              size={'small'}
                              type={'primary'}
                              icon={<PlusOutlined />}
                              onClick={() => setIterationFormVisible(true)}
                            >
                              迭代
                            </Button>
                          )}
                        </Space>
                      </Descriptions.Item>
                    </Descriptions>
                  }
                >
                  {
                    // @ts-ignore
                    `${isVersionNode ? 'v' : ''}${node.name}`
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
          parentId={selectedVersionId}
          updateInfo={updateVersionInfo}
          visible={versionFormVisible}
          afterAction={reloadVersions}
          onCancel={() => {
            setVersionFormVisible(false);
            setSelectedVersionId(undefined);
            setUpdateVersionInfo(undefined);
          }}
        />
      )}
      {iterationFormVisible && selectedVersionId && (
        <IterationForm
          form={iterationForm}
          versionId={selectedVersionId}
          visible={iterationFormVisible}
          updateInfo={updateIterationInfo}
          afterAction={reloadVersions}
          onCancel={() => {
            setIterationFormVisible(false);
            setSelectedVersionId(undefined);
            setUpdateIterationInfo(undefined);
          }}
        />
      )}
    </>
  );
};
