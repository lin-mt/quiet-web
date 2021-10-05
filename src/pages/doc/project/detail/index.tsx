import type { Key } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Empty, Input, Popconfirm, Row, Space, Tabs, Tag, Tree } from 'antd';
import styled from 'styled-components';
import ApiGroupForm from '@/pages/doc/apiGroup/components/ApiGroupForm';
import type { DocApi, DocApiGroup } from '@/services/doc/EntityType';
import { listApiInfoById } from '@/services/doc/DocProject';
import {
  DeleteOutlined,
  EditOutlined,
  PicCenterOutlined,
  PicLeftOutlined,
} from '@ant-design/icons';
import { deleteApiGroup } from '@/services/doc/DocApiGroup';
import ApiForm from '@/pages/doc/api/components/ApiForm';
import ApiDetail from '@/pages/doc/api/components/ApiDetail';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getMethodTagColor } from '@/utils/doc/utils';

const { TabPane } = Tabs;

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
          treeData.push({
            ...apiGroup,
            key: apiGroup.id,
            title: apiGroup.name,
            isLeaf: false,
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

  const apiTableColumns: ProColumns<DocApi>[] = [
    {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => {
        return (
          <a
            onClick={() => {
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
      valueType: 'select',
      valueEnum: {
        FINISH: { text: '已完成', status: 'Success' },
        UNFINISHED: { text: '未完成', status: 'Processing' },
      },
    },
    {
      title: '接口分组',
      dataIndex: 'api_group_id',
      key: 'api_group_id',
      render: (_, record) => {
        return <>{record.api_group ? record.api_group.name : '未分组'}</>;
      },
      // render: (_, record) => {
      //   const tags: DocApiGroup[][] = [];
      //   record.apiGroups?.forEach((apiGroup, index) => {
      //     if (index % 3 === 0) {
      //       tags[Math.floor(index / 3)] = [];
      //     }
      //     tags[Math.floor(index / 3)][index % 3] = apiGroup;
      //   });
      //   return (
      //     <Space direction={'vertical'} size={'small'}>
      //       {tags.map((apiGroups) => {
      //         return (
      //           <Space size={'small'} key={`${apiGroups[0].id}group`}>
      //             {apiGroups.map((apiGroup) => (
      //               <Tag key={apiGroup.id} color={'blue'}>
      //                 {apiGroup.name}
      //               </Tag>
      //             ))}
      //           </Space>
      //         );
      //       })}
      //     </Space>
      //   );
      // },
    },
  ];

  return (
    <DetailContainer>
      {loading ? (
        <Empty />
      ) : (
        <Tabs
          defaultActiveKey={'interface'}
          style={{ backgroundColor: '#fff', minHeight: 'calc(100vh - 195px)' }}
        >
          <TabPane tab={'接 口'} key={'interface'}>
            <Row gutter={20}>
              <Col flex={'300px'}>
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
              </Col>
              <Col flex={'auto'} style={{ paddingRight: 39 }}>
                {selectedNode ? (
                  <Space direction={'vertical'} style={{ width: '100%' }}>
                    {!selectedNode.isLeaf ? (
                      <>
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
                        <ProTable<DocApi>
                          search={false}
                          options={false}
                          pagination={false}
                          columns={apiTableColumns}
                          dataSource={selectedNode.children}
                        />
                      </>
                    ) : (
                      <ApiDetail apiId={selectedNode.id} projectId={projectId} />
                    )}
                  </Space>
                ) : (
                  <Empty style={{ height: '100%' }} description={'请选择分组或接口文档'} />
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tab={'设 置'} key={'setting'}>
            projectId: {props.location.query.projectId}
          </TabPane>
        </Tabs>
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
