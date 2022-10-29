import { Badge, Button, Empty, Input, Popconfirm, Space, Table, Tabs, Tag, Tree } from 'antd';
import ApiPreview from '@/pages/doc/project/detail/interface/components/ApiPreview';
import ApiEdit from '@/pages/doc/project/detail/interface/components/ApiEdit';
import type { Key } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { DocProject } from '@/services/doc/EntityType';
import { getApiDetail } from '@/services/doc/DocApi';
import ApiRun from '@/pages/doc/project/detail/interface/components/ApiRun';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PicCenterOutlined,
  PicLeftOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { DocApi, DocApiGroup } from '@/services/doc/EntityType';
import { ApiTitle } from '@/pages/doc/project/detail';
import styled from 'styled-components';
import { deleteApiGroup } from '@/services/doc/DocApiGroup';
import type { ColumnType } from 'antd/lib/table/interface';
import { getMethodTagColor } from '@/utils/doc/utils';
import { ApiState } from '@/services/doc/Enums';
import { listApiInfoById } from '@/services/doc/DocProject';
import ApiGroupForm from '@/pages/doc/apiGroup/components/ApiGroupForm';
import ApiForm from '@/pages/doc/api/components/ApiForm';

const InterfaceContainer = styled(Space)`
  width: 100%;
  > :nth-child(2) {
    width: 100%;
  }
`;

interface ApiDetailProps {
  projectInfo: DocProject;
}

export default (props: ApiDetailProps) => {
  const { projectInfo } = props;
  const unGroupKey = 'ungroup';

  const [apiDetail, setApiDetail] = useState<DocApi>();
  const [apiGroupFormVisible, setApiGroupFormVisible] = useState<boolean>(false);
  const [apiGroupCreateFormVisible, setApiGroupCreateFormVisible] = useState<boolean>(false);
  const [apiFormVisible, setApiFormVisible] = useState<boolean>(false);
  const [apiGroupTreeData, setApiGroupTreeData] = useState<DocApiGroup[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  const loadProjectApis = useCallback(() => {
    if (projectInfo.id) {
      listApiInfoById(projectInfo.id).then((resp) => {
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
      });
    }
  }, [projectInfo.id]);

  useEffect(() => {
    loadProjectApis();
  }, [loadProjectApis]);

  function handleInterfaceSearch() {}

  function handleDeleteApiGroup() {
    if (selectedNode && !selectedNode.isLeaf) {
      deleteApiGroup(selectedNode.id).then(() => {
        setSelectedNode(undefined);
        loadProjectApis();
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

  const updateSelectedApiDetail = useCallback(() => {
    if (selectedNode && selectedNode.isLeaf) {
      getApiDetail(selectedNode.id).then((detail) => setApiDetail(detail));
    }
  }, [selectedNode]);

  useEffect(() => {
    updateSelectedApiDetail();
  }, [updateSelectedApiDetail]);

  return (
    <>
      <InterfaceContainer direction={'horizontal'} align={'start'} size={'large'}>
        <div style={{ width: 300, marginTop: 15 }}>
          <Space direction={'vertical'}>
            <Space>
              <Input.Search enterButton placeholder="搜索接口" onSearch={handleInterfaceSearch} />
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
                            title={`删除该分组之后，该分组中的接口将会移到 未分组 中`}
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
                <Tabs>
                  <Tabs.TabPane
                    key={'preview'}
                    tab={
                      <span>
                        <EyeOutlined />
                        预览
                      </span>
                    }
                  >
                    {apiDetail && projectInfo && (
                      <ApiPreview apiDetail={apiDetail} projectInfo={projectInfo} />
                    )}
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key={'edit'}
                    tab={
                      <span>
                        <EditOutlined />
                        编辑
                      </span>
                    }
                  >
                    {apiDetail && projectInfo && (
                      <ApiEdit
                        apiDetail={apiDetail}
                        projectInfo={projectInfo}
                        afterUpdate={updateSelectedApiDetail}
                      />
                    )}
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key={'run'}
                    tab={
                      <span>
                        <SendOutlined />
                        运行
                      </span>
                    }
                  >
                    {apiDetail && projectInfo && (
                      <ApiRun apiDetail={apiDetail} projectInfo={projectInfo} />
                    )}
                  </Tabs.TabPane>
                </Tabs>
              )}
            </div>
          ) : (
            <Empty style={{ height: '100%' }} description={'请选择分组或接口文档'} />
          )}
        </div>
      </InterfaceContainer>

      {apiGroupFormVisible && projectInfo.id && (
        <ApiGroupForm
          projectId={projectInfo.id}
          onCancel={() => setApiGroupFormVisible(false)}
          visible={apiGroupFormVisible}
          updateInfo={selectedNode}
          afterAction={loadProjectApis}
        />
      )}
      {apiGroupCreateFormVisible && projectInfo.id && (
        <ApiGroupForm
          projectId={projectInfo.id}
          onCancel={() => setApiGroupCreateFormVisible(false)}
          visible={apiGroupCreateFormVisible}
          afterAction={loadProjectApis}
        />
      )}
      {apiFormVisible && projectInfo.id && (
        <ApiForm
          projectId={projectInfo.id}
          onCancel={() => setApiFormVisible(false)}
          initApiGroup={!selectedNode || selectedNode.key === unGroupKey ? undefined : selectedNode}
          visible={apiFormVisible}
          afterAction={loadProjectApis}
        />
      )}
    </>
  );
};
