import React, {
  forwardRef,
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Button,
  Card,
  Input,
  Modal,
  Space,
  Tooltip,
  Tree,
} from '@arco-design/web-react';
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-react/icon';
import ApiGroupForm from '@/components/doc/ApiGroupForm';
import {
  deleteApiGroup,
  getApiGroup,
  listApiGroup,
  saveApiGroup,
  updateApiGroup,
} from '@/service/doc/api-group';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import { listApi } from '@/service/doc/api';
import { getQueryParams } from '@/utils/getUrlParams';
import { QuietFormProps } from '@/components/type';
import { DocApiGroup } from '@/service/doc/type';
import {
  ApiManagerContext,
  ApiManagerContextProps,
} from '@/pages/doc/api-manager';

export enum NodeType {
  API_GROUP,
  API,
}

export type ClickNode = {
  id?: string;
  type: NodeType;
  name: string;
};

export type ApiGroupManagerProps = {
  activeId?: string;
  onTreeNodeClick?: (node: ClickNode) => void;
};

export type ApiGroupManagerRefProps = {
  reload: () => void;
};

export function ApiGroupManager(
  props: ApiGroupManagerProps,
  ref: Ref<ApiGroupManagerRefProps>
) {
  useImperativeHandle(ref, () => ({
    reload: () => {
      fetchData();
    },
  }));
  const apiManagerContext =
    useContext<ApiManagerContextProps>(ApiManagerContext);
  const defaultId = 'default';
  const [apiGroupFormProps, setApiGroupFormProps] =
    useState<QuietFormProps<DocApiGroup>>();
  const [apiGroupTreeData, setApiGroupTreeData] = useState<TreeDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>();
  const query = getQueryParams();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiManagerContext.projectId]);

  useEffect(() => {
    const selected = props.activeId
      ? props.activeId
      : query.apiId
      ? query.apiId
      : query.apiGroupId;
    if (selected) {
      setSelectedKeys([selected]);
    }
  }, [props.activeId, query.apiId, query.apiGroupId]);

  function fetchData(name?: string) {
    setLoading(true);
    listApi(apiManagerContext.projectId, name)
      .then((apis) => {
        const apiGroupId2Apis: Record<string, TreeDataType[]> = {};
        apis.forEach((api) => {
          const id = api.api_group_id ? api.api_group_id : defaultId;
          if (!apiGroupId2Apis[id]) {
            apiGroupId2Apis[id] = [];
          }
          apiGroupId2Apis[id].push({
            nodeType: NodeType.API,
            ...api,
          });
        });
        listApiGroup(apiManagerContext.projectId).then((groups) => {
          const treeData: TreeDataType[] = [
            {
              key: defaultId,
              name: '未分组',
              nodeType: NodeType.API_GROUP,
            },
          ];
          if (groups && groups.length > 0) {
            groups.map((group) => {
              const children = apiGroupId2Apis[group.id]
                ? apiGroupId2Apis[group.id]
                : undefined;
              treeData.push({
                nodeType: NodeType.API_GROUP,
                children,
                ...group,
              });
            });
          }
          setApiGroupTreeData(treeData);
        });
      })
      .finally(() => setLoading(false));
  }

  function handleNewApiGroup() {
    setApiGroupFormProps({
      title: '新建分组',
      visible: true,
      onCancel: () => setApiGroupFormProps({ visible: false }),
      onOk: (values) =>
        saveApiGroup(values).then(() => {
          setApiGroupFormProps({ visible: false });
          fetchData();
        }),
    });
  }

  function handleEditApiGroup(apiGroupId: string) {
    getApiGroup(apiGroupId).then((apiGroup) => {
      setApiGroupFormProps({
        visible: true,
        formValues: apiGroup,
        title: '更新分组信息',
        onCancel: () => setApiGroupFormProps({ visible: false }),
        onOk: (values) =>
          updateApiGroup(values).then((res) => {
            setApiGroupFormProps({ visible: false });
            if (props.onTreeNodeClick) {
              props.onTreeNodeClick({
                type: NodeType.API_GROUP,
                id: res.id,
                name: res.name,
              });
            }
            fetchData();
          }),
      });
    });
  }

  return (
    <Card
      title={'接口分组'}
      headerStyle={{ paddingRight: 8 }}
      bodyStyle={{ padding: '0 8px 8px 8px' }}
      extra={
        <Button
          onClick={() => handleNewApiGroup()}
          type={'text'}
          icon={<IconPlus />}
        >
          新建分组
        </Button>
      }
    >
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Input.Search
          allowClear
          loading={loading}
          placeholder="请输入接口名称"
          searchButton
          onSearch={(value) => fetchData(value)}
        />
        <Tree
          blockNode
          fieldNames={{
            key: 'id',
            title: 'name',
          }}
          treeData={apiGroupTreeData}
          selectedKeys={selectedKeys}
          renderExtra={(node) => {
            const dataRef = node.dataRef;
            if (
              dataRef.key === defaultId ||
              NodeType.API === dataRef.nodeType
            ) {
              return <></>;
            }
            return (
              <div>
                <Tooltip mini content={'编辑分组'}>
                  <Button
                    type={'text'}
                    size={'small'}
                    icon={<IconEdit />}
                    onClick={() => handleEditApiGroup(dataRef.key)}
                  />
                </Tooltip>
                <Tooltip mini content={'删除分组'}>
                  <Button
                    type={'text'}
                    size={'small'}
                    status={'danger'}
                    icon={<IconDelete />}
                    onClick={() => {
                      Modal.confirm({
                        title: `确认删除分组 ${dataRef.name} 吗？`,
                        content: '温馨提示：该分组的所有接口将归入【未分组】',
                        onConfirm: () => {
                          deleteApiGroup(dataRef.id).then(() => {
                            if (selectedKeys[0] === dataRef.id) {
                              if (props.onTreeNodeClick) {
                                props.onTreeNodeClick({
                                  type: NodeType.API_GROUP,
                                  id: undefined,
                                  name: '未分组',
                                });
                              }
                              setSelectedKeys([defaultId]);
                            }
                            fetchData();
                          });
                        },
                      });
                    }}
                  />
                </Tooltip>
              </div>
            );
          }}
          onSelect={(keys, extra) => {
            setSelectedKeys(keys);
            if (props.onTreeNodeClick) {
              const nodeData = extra.node.props.dataRef;
              props.onTreeNodeClick({
                type: nodeData.nodeType,
                id: nodeData.key === defaultId ? undefined : nodeData.id,
                name: nodeData.name,
              });
            }
          }}
        />
      </Space>
      <ApiGroupForm
        projectId={apiManagerContext.projectId}
        {...apiGroupFormProps}
      />
    </Card>
  );
}

export default forwardRef(ApiGroupManager);
