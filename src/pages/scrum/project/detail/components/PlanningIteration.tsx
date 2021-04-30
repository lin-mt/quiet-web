import {
  Button,
  Card,
  Descriptions,
  Empty,
  Form,
  Popconfirm,
  Popover,
  Space,
  Spin,
  Tree,
} from 'antd';
import type { Key } from 'react';
import { useEffect, useState } from 'react';
import { deleteVersion, findDetailsByProjectId } from '@/services/scrum/ScrumVersion';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import VersionForm from '@/pages/scrum/project/detail/components/VersionForm';
import { iterationsAddToChildren } from '@/utils/scrum/utils';
import IterationForm from '@/pages/scrum/project/detail/components/IterationForm';
import { deleteIteration } from '@/services/scrum/ScrumIteration';
import { formatDate, toMomentDate } from '@/utils/MomentUtils';

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
                              if (isVersionNode) {
                                versionForm.setFieldsValue(nodeValues);
                                setUpdateVersionInfo(node);
                                setVersionFormVisible(true);
                              } else {
                                iterationForm.setFieldsValue(nodeValues);
                                setSelectedVersionId(nodeValues.id);
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
