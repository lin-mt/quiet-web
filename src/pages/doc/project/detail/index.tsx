import type { Key } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Empty, Input, Menu, Popconfirm, Space, Table, Tag, Tree } from 'antd';
import styled from 'styled-components';
import ApiGroupForm from '@/pages/doc/apiGroup/components/ApiGroupForm';
import type { DocApi, DocApiGroup } from '@/services/doc/EntityType';
import { listApiInfoById } from '@/services/doc/DocProject';
import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PicCenterOutlined,
  PicLeftOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { deleteApiGroup } from '@/services/doc/DocApiGroup';
import ApiForm from '@/pages/doc/api/components/ApiForm';
import ApiDetail from '@/pages/doc/api/components/ApiDetail';
import Setting from '@/pages/doc/project/detail/setting';
import { getMethodTagColor } from '@/utils/doc/utils';
import type { MenuInfo } from 'rc-menu/es/interface';
import type { ColumnType } from 'antd/lib/table/interface';
import { ApiState } from '@/services/doc/Enums';

const DetailContainer = styled.div`
  margin-top: -24px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  background-color: white;
`;

export const ApiTitle = styled.h2`
  display: flex;
  align-items: center;
  height: 32px;
  float: left;
  border-left: 3px solid #1890ff;
  padding-left: 8px;
  font-weight: 399;
  margin: 0;
`;

const InterfaceContainer = styled(Space)`
  width: 100%;
  > :nth-child(2) {
    width: 100%;
  }
`;

const ProjectDetails: React.FC<any> = (props) => {
  const { projectId } = props.location.query;
  const unGroupKey = 'ungroup';

  const [apiGroupFormVisible, setApiGroupFormVisible] = useState<boolean>(false);
  const [apiGroupCreateFormVisible, setApiGroupCreateFormVisible] = useState<boolean>(false);
  const [apiFormVisible, setApiFormVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>();
  const [apiGroupTreeData, setApiGroupTreeData] = useState<DocApiGroup[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [current, setCurrent] = useState<string>('interface');

  const loadProjectApiInfo = useCallback(() => {
    listApiInfoById(projectId).then((resp) => {
      const treeData: DocApiGroup[] = [];
      const unGroupNode: any = {
        key: unGroupKey,
        title: '未分组',
        isLeaf: false,
        icon: (nodeProps: any) => {
          return nodeProps.expanded ? <PicLeftOutlined /> : <PicCenterOutlined />;
        },
        children: resp.ungroup?.map((api) => {
          return { ...api, key: api.id, title: api.name, isLeaf: true, icon: <></> };
        }),
      };
      treeData.unshift(unGroupNode);
      if (resp.api_groups) {
        resp.api_groups.forEach((apiGroup) => {
          if (!apiGroup.id) {
            return;
          }
          treeData.push({
            ...apiGroup,
            key: apiGroup.id,
            title: apiGroup.name,
            isLeaf: false,
            // @ts-ignore
            children: resp.grouped[apiGroup.id]?.map((api) => {
              return { ...api, key: api.id, title: api.name, isLeaf: true, icon: <></> };
            }),
          });
        });
      }
      setApiGroupTreeData(treeData);
      setLoading(false);
    });
  }, [projectId]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      loadProjectApiInfo();
    }
    return () => {
      isMounted = false;
    };
  }, [loadProjectApiInfo]);

  function handleInterfaceSearch() {}

  function handleDeleteApiGroup() {
    if (selectedNode) {
      deleteApiGroup(selectedNode.id).then(() => {
        loadProjectApiInfo();
        setSelectedNode(undefined);
      });
    }
  }

  const apiTableColumns: ColumnType<DocApi>[] = [
    {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              // @ts-ignore
              setSelectedKeys([record.id]);
              // @ts-ignore
              setSelectedNode(record);
            }}
          >
            {record.name}
          </a>
        );
      },
    },
    {
      title: '接口路径',
      key: 'path',
      render: (_: any, record: { method: any; path: any }) => {
        return (
          <>
            <Tag color={getMethodTagColor(record.method)}> {record.method}</Tag>
            {record.path}
          </>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'api_state',
      key: 'api_state',
      render: (_: any, record) => {
        return (
          <Badge
            status={record.api_state === ApiState.FINISHED ? 'success' : 'processing'}
            text={record.api_state === ApiState.FINISHED ? '完成' : '未完成'}
          />
        );
      },
    },
    {
      title: '接口分组',
      dataIndex: 'api_group_id',
      key: 'api_group_id',
      render: (_, record) => {
        return <>{record.api_group ? record.api_group.name : '未分组'}</>;
      },
    },
  ];

  function handleCurrentMenuChange(info: MenuInfo) {
    setCurrent(info.key);
  }

  return (
    <DetailContainer>
      {loading ? (
        <Empty />
      ) : (
        <div style={{ backgroundColor: '#fff', minHeight: 'calc(100vh - 195px)' }}>
          <Menu selectedKeys={[current]} onClick={handleCurrentMenuChange} mode={'horizontal'}>
            <Menu.Item key={'interface'} icon={<FileTextOutlined />}>
              接口
            </Menu.Item>
            <Menu.Item key={'setting'} icon={<SettingOutlined />}>
              设置
            </Menu.Item>
          </Menu>
          {current === 'interface' && (
            <InterfaceContainer direction={'horizontal'} align={'start'} size={'large'}>
              <div style={{ width: 300, marginTop: 15 }}>
                <Space direction={'vertical'}>
                  <Space>
                    <Input.Search
                      enterButton
                      placeholder="搜索接口"
                      onSearch={handleInterfaceSearch}
                    />
                    <Button type={'primary'} onClick={() => setApiGroupCreateFormVisible(true)}>
                      添加分组
                    </Button>
                  </Space>
                  <Tree.DirectoryTree
                    treeData={apiGroupTreeData}
                    selectedKeys={selectedKeys}
                    onSelect={(keys, { node }) => {
                      // @ts-ignore
                      setSelectedNode(node);
                      setSelectedKeys(keys);
                    }}
                  />
                </Space>
              </div>
              <div style={{ paddingRight: 39 }}>
                {selectedNode ? (
                  <div style={{ width: '100%' }}>
                    {!selectedNode.isLeaf ? (
                      <div style={{ marginTop: 15 }}>
                        <div style={{ height: 32 }}>
                          <Space align={'end'}>
                            <ApiTitle>{selectedNode.title}</ApiTitle>
                            <span style={{ fontSize: 12, color: '#1890ff' }}>
                              共{selectedNode.children ? selectedNode.children.length : 0}
                              个接口
                            </span>
                          </Space>
                          <Space style={{ float: 'right' }} size={'middle'}>
                            <Button type={'primary'} onClick={() => setApiFormVisible(true)}>
                              添加接口
                            </Button>
                            {selectedNode.key !== unGroupKey && (
                              <>
                                <Button
                                  icon={<EditOutlined />}
                                  type={'primary'}
                                  title={'编辑接口'}
                                  onClick={() => setApiGroupFormVisible(true)}
                                />
                                <Popconfirm
                                  title={`删除该分组之后，仅存在该分组中的接口将会移到未分组中`}
                                  placement={'topRight'}
                                  onConfirm={handleDeleteApiGroup}
                                >
                                  <Button
                                    danger={true}
                                    icon={<DeleteOutlined />}
                                    type={'primary'}
                                    title={'删除分组'}
                                  />
                                </Popconfirm>
                              </>
                            )}
                          </Space>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <Table<DocApi>
                            size={'middle'}
                            pagination={false}
                            columns={apiTableColumns}
                            dataSource={selectedNode.children}
                          />
                        </div>
                      </div>
                    ) : (
                      <ApiDetail
                        apiId={selectedNode.id}
                        projectId={projectId}
                        afterUpdate={() => loadProjectApiInfo()}
                      />
                    )}
                  </div>
                ) : (
                  <Empty style={{ height: '100%' }} description={'请选择分组或接口文档'} />
                )}
              </div>
            </InterfaceContainer>
          )}
          {current === 'setting' && (
            <div style={{ marginTop: 10 }}>
              <Setting projectId={projectId} />
            </div>
          )}
        </div>
      )}
      {apiGroupFormVisible && (
        <ApiGroupForm
          projectId={projectId}
          onCancel={() => setApiGroupFormVisible(false)}
          visible={apiGroupFormVisible}
          updateInfo={selectedNode}
          afterAction={loadProjectApiInfo}
        />
      )}
      {apiGroupCreateFormVisible && (
        <ApiGroupForm
          projectId={projectId}
          onCancel={() => setApiGroupCreateFormVisible(false)}
          visible={apiGroupCreateFormVisible}
          afterAction={loadProjectApiInfo}
        />
      )}
      {apiFormVisible && (
        <ApiForm
          projectId={projectId}
          onCancel={() => setApiFormVisible(false)}
          initApiGroup={!selectedNode || selectedNode.key === unGroupKey ? undefined : selectedNode}
          visible={apiFormVisible}
          afterAction={loadProjectApiInfo}
        />
      )}
    </DetailContainer>
  );
};

export default ProjectDetails;
