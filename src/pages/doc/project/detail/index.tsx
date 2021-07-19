import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Empty, Input, Popconfirm, Row, Space, Tabs, Tree } from 'antd';
import styled from 'styled-components';
import ApiGroupForm from '@/pages/doc/apiGroup/components/ApiGroupForm';
import type { DocApiGroup } from '@/services/doc/EntityType';
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

const { TabPane } = Tabs;

const DetailContainer = styled.div`
  margin-top: -24px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  background-color: white;
`;

const ApiTitle = styled.h2`
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
  const [apiFormVisible, setApiFormVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>();
  const [apiGroupTreeData, setApiGroupTreeData] = useState<DocApiGroup[]>([]);
  const [selectedApiGroup, setSelectedApiGroup] = useState<DocApiGroup>();

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
      if (resp.apiGroups) {
        resp.apiGroups.forEach((apiGroup) => {
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
    if (selectedApiGroup) {
      deleteApiGroup(selectedApiGroup.id).then(() => loadProjectApiInfo());
    }
  }

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
                    <Button type={'primary'} onClick={() => setApiGroupFormVisible(true)}>
                      添加分组
                    </Button>
                  </Space>
                  <Tree.DirectoryTree
                    treeData={apiGroupTreeData}
                    // @ts-ignore
                    onClick={(_, node) => setSelectedApiGroup(node)}
                  />
                </Space>
              </Col>
              <Col flex={'auto'} style={{ paddingRight: 39 }}>
                {selectedApiGroup ? (
                  <Space direction={'vertical'} style={{ width: '100%' }}>
                    {!selectedApiGroup.isLeaf ? (
                      <>
                        <div>
                          <ApiTitle>{selectedApiGroup.title}</ApiTitle>
                          <Space style={{ float: 'right' }} size={'middle'}>
                            <Button type={'primary'} onClick={() => setApiFormVisible(true)}>
                              添加接口
                            </Button>
                            {selectedApiGroup.key !== unGroupKey && (
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
                        <div>接口文档表格信息</div>
                      </>
                    ) : (
                      <ApiDetail />
                    )}
                  </Space>
                ) : (
                  <Empty style={{ height: '100%' }} description={'请选择分组或接口文档'} />
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tab={'设 置'} key={'setting'}>
            {props.location.query.projectId}
          </TabPane>
        </Tabs>
      )}
      {apiGroupFormVisible && (
        <ApiGroupForm
          projectId={projectId}
          onCancel={() => setApiGroupFormVisible(false)}
          visible={apiGroupFormVisible}
          updateInfo={selectedApiGroup}
          afterAction={loadProjectApiInfo}
        />
      )}
      {apiFormVisible && (
        <ApiForm
          projectId={projectId}
          onCancel={() => setApiFormVisible(false)}
          initApiGroups={
            !selectedApiGroup || selectedApiGroup.key === unGroupKey
              ? undefined
              : [selectedApiGroup]
          }
          visible={apiFormVisible}
          afterAction={loadProjectApiInfo}
        />
      )}
    </DetailContainer>
  );
};

export default ProjectDetails;
