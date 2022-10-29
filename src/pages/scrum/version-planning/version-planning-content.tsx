import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Empty,
  Grid,
  Link,
  Modal,
  Space,
  Table,
  TableColumnProps,
  Tag,
  Tooltip,
  Tree,
  Typography,
} from '@arco-design/web-react';
import {
  deleteVersion,
  saveVersion,
  treeVersion,
  updateVersion,
} from '@/service/scrum/version';
import {
  PlanningType,
  ScrumIteration,
  ScrumVersion,
} from '@/service/scrum/type';
import {
  deleteIteration,
  listIteration,
  saveIteration,
  updateIteration,
} from '@/service/scrum/iteration';
import _ from 'lodash';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import {
  IconCalendar,
  IconDelete,
  IconEdit,
  IconPlus,
} from '@arco-design/web-react/icon';
import VersionForm from '@/components/scrum/VersionForm';
import { QuietFormProps } from '@/components/type';
import IterationForm from '@/components/scrum/IterationForm';

const { Row, Col } = Grid;

export type VersionPlanningContentProps = {
  projectId: string;
};

function VersionPlanningContent(props: VersionPlanningContentProps) {
  const [treeData, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState<TreeDataType>();
  const [versionFormProps, setVersionFormProps] =
    useState<QuietFormProps<ScrumVersion>>();
  const [iterationFormProps, setIterationFormProps] =
    useState<QuietFormProps<ScrumIteration>>();
  const [planningDescription, setPlanningDescription] = useState([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const getIds = (vs: ScrumVersion[]) => {
    const ids: string[] = [];
    if (vs && vs.length > 0) {
      vs.forEach((v) => {
        ids.push(v.id);
        if (v.children) {
          ids.push(...getIds(v.children));
        }
      });
    }
    return ids;
  };

  const buildTreeData = (
    vs: ScrumVersion[],
    vId2It: Record<string, ScrumIteration[]>
  ) => {
    const vsClone: ScrumVersion[] = _.cloneDeep(vs);
    const isClone: ScrumIteration[] = [];
    vsClone.forEach((vs) => {
      vs.type = PlanningType.VERSION;
      const iChildren = [];
      if (vId2It && vId2It[vs.id]) {
        vId2It[vs.id].forEach((i) => {
          const iClone = _.clone(i);
          iClone.type = PlanningType.ITERATION;
          iChildren.push(iClone);
        });
      }
      vs.children = buildTreeData(vs.children, vId2It);
      vs.children.unshift(...iChildren);
    });
    return [].concat(...vsClone, ...isClone);
  };

  useEffect(() => {
    loadVersionTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.projectId]);

  useEffect(() => {
    if (!selectedNode) {
      return;
    }
    setPlanningDescription([
      {
        label: '名称',
        value: selectedNode.name,
      },
      {
        label: 'ID',
        value: <Typography.Text copyable>{selectedNode.id}</Typography.Text>,
      },
      {
        label: '计划开始日期',
        value: selectedNode.plan_start_date,
      },
      {
        label: '计划结束日期',
        value: selectedNode.plan_end_date,
      },
      {
        label: '实际开始时间',
        value: selectedNode.start_time,
      },
      {
        label: '实际结束时间',
        value: selectedNode.end_time,
      },
      {
        label: '备注',
        value: selectedNode.remark,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedNode)]);

  const loadVersionTree = () => {
    treeVersion(props.projectId).then((vs) => {
      const versionIds = getIds(vs);
      listIteration(versionIds).then((its) => {
        const vId2It: Record<string, ScrumIteration[]> = {};
        if (its && its.length > 0) {
          its.forEach((it) => {
            if (!vId2It[it.version_id]) {
              vId2It[it.version_id] = [];
            }
            vId2It[it.version_id].push(it);
          });
        }
        setTreeData(buildTreeData(vs, vId2It));
      });
    });
  };

  function handleCreateRootVersion() {
    setVersionFormProps({
      visible: true,
      title: '新建版本',
      onOk: (values) => {
        return saveVersion(values).then(() => {
          loadVersionTree();
          setVersionFormProps({ visible: false });
        });
      },
      onCancel: () => setVersionFormProps({ visible: false }),
    });
  }

  function handleEditSelectedNode() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formValues: any = selectedNode;
    if (PlanningType.VERSION === selectedNode.type) {
      setVersionFormProps({
        visible: true,
        title: '编辑版本',
        formValues,
        onOk: (values) => {
          return updateVersion(values).then((resp) => {
            setSelectedNode((prevState) => ({ ...prevState, ...resp }));
            loadVersionTree();
            setVersionFormProps({ visible: false });
          });
        },
        onCancel: () => setVersionFormProps({ visible: false }),
      });
    } else {
      setIterationFormProps({
        visible: true,
        title: '编辑迭代',
        formValues,
        onOk: (values) => {
          return updateIteration(values).then((resp) => {
            setSelectedNode((prevState) => ({ ...prevState, ...resp }));
            loadVersionTree();
            setIterationFormProps({ visible: false });
          });
        },
        onCancel: () => setIterationFormProps({ visible: false }),
      });
    }
  }

  function handleCreateChildVersion() {
    setVersionFormProps({
      visible: true,
      title: '新建版本',
      parentId: selectedNode.id,
      onOk: (values) => {
        return saveVersion(values).then(() => {
          loadVersionTree();
          setVersionFormProps({ visible: false });
        });
      },
      onCancel: () => setVersionFormProps({ visible: false }),
    });
  }

  function handleDeleteSelectedNode() {
    Modal.confirm({
      title: '警告',
      content: `确认删除${
        PlanningType.VERSION === selectedNode.type ? '版本' : '迭代'
      } ${selectedNode.name} 吗？`,
      onConfirm: async () => {
        if (PlanningType.VERSION === selectedNode.type) {
          await deleteVersion(selectedNode.id);
        } else {
          await deleteIteration(selectedNode.id);
        }
        loadVersionTree();
        setSelectedNode(undefined);
      },
    });
  }

  function handleCreateIteration() {
    setIterationFormProps({
      visible: true,
      title: '新建迭代',
      versionId: selectedNode.id,
      onOk: (values) => {
        return saveIteration(values).then(() => {
          loadVersionTree();
          setIterationFormProps({ visible: false });
        });
      },
      onCancel: () => setIterationFormProps({ visible: false }),
    });
  }

  function isVersion(selectedNode) {
    if (!selectedNode) {
      return false;
    }
    return PlanningType.VERSION === selectedNode.type;
  }

  const iterationColumns: TableColumnProps[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      render: (id, item) => {
        return (
          <Typography.Text copyable>
            <Link
              onClick={() => {
                setSelectedIds([id]);
                setSelectedNode(item);
              }}
            >
              {id}
            </Link>
          </Typography.Text>
        );
      },
    },
    {
      title: '迭代名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      render: (_, item) => {
        let tag;
        if (!item.start_time) {
          tag = <Tag color={'arcoblue'}>未开始</Tag>;
        } else if (!item.end_time) {
          tag = <Tag color={'green'}>进行中</Tag>;
        } else {
          tag = <Tag color={'purple'}>已结束</Tag>;
        }
        return (
          <Tooltip
            content={
              <Space direction={'vertical'}>
                <span>计划开始时间：{item.plan_start_date}</span>
                <span>计划结束时间：{item.plan_end_date}</span>
              </Space>
            }
          >
            {tag}
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Row gutter={20} style={{ width: '100%' }}>
      <Col span={12}>
        <Card
          title={'项目规划'}
          bodyStyle={{ paddingTop: 0 }}
          extra={
            <Space>
              <Button disabled type={'text'} icon={<IconCalendar />}>
                规划图
              </Button>
              <Button
                type={'text'}
                icon={<IconPlus />}
                onClick={handleCreateRootVersion}
              >
                创建版本
              </Button>
            </Space>
          }
        >
          <Space
            size={0}
            style={{ padding: 5, float: 'right' }}
            split={<Divider type="vertical" />}
          >
            <div style={{ fontSize: 12, color: 'var(--color-text-2)' }}>
              版本状态 / 迭代状态
            </div>
            <Tag color={'arcoblue'} size={'small'}>
              未开始
            </Tag>
            <Tag color={'green'} size={'small'}>
              进行中
            </Tag>
            <Tag color={'purple'} size={'small'}>
              已结束
            </Tag>
          </Space>
          <Divider style={{ margin: '5px 0' }} />
          <Tree
            blockNode
            treeData={treeData}
            selectedKeys={selectedIds}
            actionOnClick={['select', 'expand']}
            fieldNames={{ key: 'id', title: 'name' }}
            onSelect={(ids, { node }) => {
              setSelectedIds(ids);
              setSelectedNode(node.props.dataRef);
            }}
            renderTitle={(pro) => {
              let tagColor;
              if (!pro.dataRef.start_time) {
                tagColor = 'arcoblue';
              } else if (!pro.dataRef.end_time) {
                tagColor = 'green';
              } else {
                tagColor = 'purple';
              }
              return (
                <Space>
                  {isVersion(pro.dataRef) ? (
                    <Tag color={tagColor} size={'small'}>
                      版本
                    </Tag>
                  ) : (
                    <Tag color={tagColor} size={'small'}>
                      迭代
                    </Tag>
                  )}
                  {pro.title}
                </Space>
              );
            }}
          />
        </Card>
      </Col>
      <Col span={12}>
        {selectedNode ? (
          <Card
            bodyStyle={{ paddingTop: 0 }}
            title={isVersion(selectedNode) ? '版本信息' : '迭代信息'}
            extra={
              <Space>
                <Button
                  type={'text'}
                  icon={<IconEdit />}
                  onClick={handleEditSelectedNode}
                >
                  编辑
                </Button>
                {isVersion(selectedNode) && (
                  <Button
                    type={'text'}
                    icon={<IconPlus />}
                    onClick={handleCreateChildVersion}
                  >
                    新建子版本
                  </Button>
                )}
                {isVersion(selectedNode) && (
                  <Button
                    type={'text'}
                    icon={<IconPlus />}
                    onClick={handleCreateIteration}
                  >
                    新建迭代
                  </Button>
                )}
                <Button
                  type={'text'}
                  status={'danger'}
                  icon={<IconDelete />}
                  onClick={handleDeleteSelectedNode}
                >
                  删除
                </Button>
              </Space>
            }
          >
            <Descriptions border column={2} data={planningDescription} />
            <div style={{ marginTop: 15 }}>
              {isVersion(selectedNode) ? (
                <Table
                  border
                  rowKey={'id'}
                  pagination={false}
                  columns={iterationColumns}
                  data={selectedNode.children.filter((c) => !isVersion(c))}
                />
              ) : (
                <Empty description={'无规划的需求信息'} />
              )}
            </div>
          </Card>
        ) : (
          <Empty
            style={{ marginTop: 20 }}
            description={'请在左侧选择版本或迭代'}
          />
        )}
      </Col>
      <VersionForm projectId={props.projectId} {...versionFormProps} />
      <IterationForm versionId={selectedNode?.id} {...iterationFormProps} />
    </Row>
  );
}

export default VersionPlanningContent;
