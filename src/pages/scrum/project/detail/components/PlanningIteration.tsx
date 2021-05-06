import { Button, Card, Descriptions, Empty, Popconfirm, Popover, Space, Spin, Tree } from 'antd';
import type { Key } from 'react';
import { useEffect, useState } from 'react';
import { deleteVersion, findDetailsByProjectId } from '@/services/scrum/ScrumVersion';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import VersionForm from '@/pages/scrum/version/components/VersionForm';
import { iterationsAddToChildren } from '@/utils/scrum/utils';
import IterationForm from '@/pages/scrum/iteration/components/IterationForm';
import { deleteIteration } from '@/services/scrum/ScrumIteration';
import { formatDate, toMomentDate } from '@/utils/MomentUtils';
import { useModel } from 'umi';
import { PROJECT_DETAIL } from '@/constant/scrum/ModelNames';
import type { ScrumIteration, ScrumVersion } from '@/services/scrum/EntitiyType';

export default () => {
  const { projectId, versions, setVersions } = useModel(PROJECT_DETAIL);

  const [loading, setLoading] = useState<boolean>(true);
  const [versionFormVisible, setVersionFormVisible] = useState<boolean>(false);
  const [iterationFormVisible, setIterationFormVisible] = useState<boolean>(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string>();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>();
  const [updateVersionInfo, setUpdateVersionInfo] = useState<ScrumVersion>();
  const [updateIterationInfo, setUpdateIterationInfo] = useState<ScrumIteration>();

  function reloadVersions() {
    if (projectId) {
      setLoading(true);
      findDetailsByProjectId(projectId).then((projectVersions) => {
        setVersions(iterationsAddToChildren(projectVersions));
        setLoading(false);
      });
    }
  }

  useEffect(() => {
    if (projectId) {
      setLoading(true);
      findDetailsByProjectId(projectId).then((projectVersions) => {
        setVersions(iterationsAddToChildren(projectVersions));
        setLoading(false);
      });
    }
  }, [projectId, setVersions]);

  return (
    <>
      <Card
        title={'规划迭代'}
        size={'small'}
        bordered={false}
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
              <Empty description={'无版本信息'}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setSelectedVersionId(undefined);
                    setVersionFormVisible(true);
                  }}
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
              const nodeValues: any = {
                ...node,
                // @ts-ignore
                planStartDate: toMomentDate(node.planStartDate),
                // @ts-ignore
                planEndDate: toMomentDate(node.planEndDate),
              };
              const isVersionNode = !nodeValues.versionId;
              const showAddVersion =
                isVersionNode &&
                (!nodeValues.children ||
                  !nodeValues.iterations ||
                  nodeValues.iterations.length === 0);
              const showAddIteration =
                isVersionNode &&
                (!nodeValues.children ||
                  nodeValues.children.length === 0 ||
                  (nodeValues.iterations && nodeValues.iterations.length > 0));
              return (
                <Popover
                  title={null}
                  placement={'bottom'}
                  trigger={'click'}
                  content={
                    <Descriptions column={1} size={'small'} style={{ width: '360px' }}>
                      <Descriptions.Item label="备注">{nodeValues.remark}</Descriptions.Item>
                      <Descriptions.Item label="计划开始日期">
                        {formatDate(nodeValues.planStartDate)}
                      </Descriptions.Item>
                      <Descriptions.Item label="计划开始日期">
                        {formatDate(nodeValues.planEndDate)}
                      </Descriptions.Item>
                      <Descriptions.Item>
                        <Space>
                          <Button
                            size={'small'}
                            type={'primary'}
                            icon={<EditOutlined />}
                            onClick={() => {
                              setSelectedVersionId(nodeValues.id);
                              if (isVersionNode) {
                                setUpdateVersionInfo(nodeValues);
                                setVersionFormVisible(true);
                              } else {
                                setUpdateIterationInfo(nodeValues);
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
                              onClick={() => {
                                setSelectedVersionId(nodeValues.id);
                                setVersionFormVisible(true);
                              }}
                            >
                              子版本
                            </Button>
                          )}
                          {showAddIteration && (
                            <Button
                              size={'small'}
                              type={'primary'}
                              icon={<PlusOutlined />}
                              onClick={() => {
                                setSelectedVersionId(nodeValues.id);
                                setIterationFormVisible(true);
                              }}
                            >
                              迭代
                            </Button>
                          )}
                          <Popconfirm
                            placement={'bottom'}
                            title={`确认删除${isVersionNode ? '版本' : '迭代'} ${
                              nodeValues.name
                            } 吗？`}
                            onConfirm={async () => {
                              if (isVersionNode) {
                                await deleteVersion(nodeValues.id);
                              } else {
                                await deleteIteration(nodeValues.id);
                              }
                              reloadVersions();
                            }}
                          >
                            <Button
                              danger={true}
                              size={'small'}
                              type={'primary'}
                              icon={<DeleteOutlined />}
                            >
                              删除
                            </Button>
                          </Popconfirm>
                        </Space>
                      </Descriptions.Item>
                    </Descriptions>
                  }
                >
                  {`${isVersionNode ? 'v' : ''}${nodeValues.name}`}
                </Popover>
              );
            }}
          />
        )}
      </Card>
      {versionFormVisible && projectId && (
        <VersionForm
          projectId={projectId}
          parentId={selectedVersionId}
          updateInfo={updateVersionInfo}
          visible={versionFormVisible}
          afterAction={reloadVersions}
          onCancel={() => setVersionFormVisible(false)}
        />
      )}
      {iterationFormVisible && selectedVersionId && (
        <IterationForm
          versionId={selectedVersionId}
          visible={iterationFormVisible}
          updateInfo={updateIterationInfo}
          afterAction={reloadVersions}
          onCancel={() => setIterationFormVisible(false)}
        />
      )}
    </>
  );
};
