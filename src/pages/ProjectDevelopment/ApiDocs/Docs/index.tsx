import { addApiDocs } from '@/services/quiet/apiDocsController';
import {
  addApiDocsGroup,
  deleteApiDocsGroup,
  treeApiDocsGroupDetail,
  updateApiDocsGroup,
} from '@/services/quiet/apiDocsGroupController';
import { apiDocsStateTag, ApiMethod, IdName, methodTag } from '@/util/Utils';
import {
  CodeOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import type { TableProps, TabsProps } from 'antd';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Flex,
  Form,
  Input,
  Popconfirm,
  Row,
  Table,
  Tabs,
  theme,
  Tree,
  type TreeDataNode,
  Typography,
} from 'antd';
import React, { useEffect } from 'react';

const cardStyles = {
  header: { padding: '0px 13px', minHeight: 45, fontWeight: 480 },
  body: { padding: '10px 5px' },
};

type ApiProps = {
  projectId: string;
};

type ApiDocsGroupDetail = TreeDataNode & {
  key: string;
  apiDocs?: API.ApiDocsVO[];
  groupInfo?: API.ApiDocsGroupDetail;
  apiDocsInfo?: API.ApiDocsVO;
};

type SelectedNode = {
  groupInfo?: API.ApiDocsGroupDetail;
  apiDocsInfo?: API.ApiDocsVO;
};

function Docs(props: ApiProps) {
  const { projectId } = props;
  const { token } = theme.useToken();
  const [addApiGroupForm] = Form.useForm();
  const [updateApiGroupForm] = Form.useForm();
  const [addApiDocsForm] = Form.useForm();
  const [apiDocsGroup, setApiDocsGroup] = React.useState<API.ApiDocsGroupDetail[]>([]);
  const [apiDocsGroupDetail, setApiDocsGroupDetail] = React.useState<ApiDocsGroupDetail[]>([]);
  const [selectedNode, setSelectedNode] = React.useState<SelectedNode>();

  const apiDocsTableColumns: TableProps<API.ApiDocsVO>['columns'] = [
    {
      title: '接口名称',
      dataIndex: 'name',
      render: (_, docs) => (
        <Typography.Link onClick={() => setSelectedNode({ apiDocsInfo: docs })}>
          {docs.name}
        </Typography.Link>
      ),
    },
    {
      title: '接口路径',
      render: (_, docs) => (
        <>
          {methodTag(docs.method)}
          {docs.path}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 100,
      render: (state) => apiDocsStateTag(state),
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
  ];

  function generateTreeData(data?: API.ApiDocsGroupDetail[]): ApiDocsGroupDetail[] {
    return data
      ? data.map((item) => {
          let children: ApiDocsGroupDetail[] = [];
          const node: ApiDocsGroupDetail = {
            key: item.id,
            icon: (props) => {
              return props.expanded ? <FolderOpenOutlined /> : <FolderOutlined />;
            },
            title: item.name,
            apiDocs: item.apiDocs,
            groupInfo: item,
          };
          if (selectedNode?.groupInfo && item.id === selectedNode.groupInfo.id) {
            setSelectedNode({ groupInfo: item });
          }
          if (item.children && item.children.length > 0) {
            children = children.concat(...generateTreeData(item.children));
          }
          if (item.apiDocs && item.apiDocs.length > 0) {
            const apiDocs: ApiDocsGroupDetail[] = item.apiDocs.map((docs) => {
              if (selectedNode?.apiDocsInfo && docs.id === selectedNode.apiDocsInfo.id) {
                setSelectedNode({ apiDocsInfo: docs });
              }
              return {
                key: docs.id,
                title: (
                  <>
                    {methodTag(docs.method)}
                    {docs.name}
                  </>
                ),
                apiDocsInfo: docs,
              };
            });
            children = children.concat(...apiDocs);
          }
          node.children = children;
          return node;
        })
      : [];
  }

  function updateApiDocsGroupDetail(name?: string) {
    treeApiDocsGroupDetail({ projectId, name }).then((resp) => {
      setApiDocsGroup(resp);
      setApiDocsGroupDetail(generateTreeData(resp));
    });
  }

  const items: TabsProps['items'] = [
    {
      key: 'preview',
      icon: <EyeOutlined />,
      label: '预览',
      children: 'Content of Tab Pane 1',
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
      children: 'Content of Tab Pane 2',
    },
    {
      key: 'debug',
      icon: <CodeOutlined />,
      label: '调试',
      children: 'Content of Tab Pane 3',
    },
  ];

  useEffect(() => {
    updateApiDocsGroupDetail();
  }, [projectId]);

  return (
    <Row gutter={[20, 0]}>
      <Col span={6}>
        <Card
          title={'接口分组'}
          bordered={false}
          styles={cardStyles}
          extra={
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'addApiDocsGroup',
                    label: (
                      <ModalForm
                        width={630}
                        form={addApiGroupForm}
                        labelCol={{ span: 4 }}
                        title={'新建分组'}
                        layout="horizontal"
                        trigger={
                          <div
                            onClick={() =>
                              addApiGroupForm.setFieldsValue({
                                parentId: selectedNode?.groupInfo?.id,
                              })
                            }
                          >
                            <PlusOutlined /> 新建分组
                          </div>
                        }
                        onFinish={async () => {
                          const values = await addApiGroupForm.validateFields();
                          values.projectId = projectId;
                          return addApiDocsGroup(values).then(() => {
                            updateApiDocsGroupDetail();
                            addApiGroupForm.resetFields();
                            return true;
                          });
                        }}
                      >
                        <ProFormText
                          name={'name'}
                          label={'分组名称'}
                          rules={[
                            { required: true, message: '请输入分组名称' },
                            { max: 30, message: '分组名称不能超过 30 个字符' },
                          ]}
                        />
                        <ProFormTreeSelect
                          allowClear
                          name={'parentId'}
                          label={'父分组'}
                          fieldProps={{ fieldNames: IdName, treeData: apiDocsGroup }}
                        />
                        <ProFormTextArea
                          name={'description'}
                          label={'描述'}
                          rules={[{ max: 255, message: '描述信息不能超过 255 个字符' }]}
                        />
                      </ModalForm>
                    ),
                  },
                  {
                    key: 'addApiDocs',
                    label: (
                      <ModalForm
                        width={660}
                        form={addApiDocsForm}
                        labelCol={{ span: 4 }}
                        title={'新建接口'}
                        layout="horizontal"
                        trigger={
                          <div
                            onClick={() =>
                              addApiDocsForm.setFieldsValue({
                                groupId: selectedNode?.groupInfo?.id,
                              })
                            }
                          >
                            <PlusOutlined /> 新建接口
                          </div>
                        }
                        onFinish={async () => {
                          const values = await addApiDocsForm.validateFields();
                          values.projectId = projectId;
                          return addApiDocs(values).then(() => {
                            updateApiDocsGroupDetail();
                            addApiDocsForm.resetFields();
                            return true;
                          });
                        }}
                      >
                        <ProFormText
                          name={'name'}
                          label={'接口名称'}
                          rules={[
                            { required: true, message: '请输入接口名称' },
                            { max: 30, message: '分组名称不能超过 30 个字符' },
                          ]}
                        />
                        <ProFormSelect
                          name={'method'}
                          label={'请求方法'}
                          style={{ width: 130 }}
                          options={Object.values(ApiMethod)}
                          rules={[{ required: true, message: '请选择接口请求方法' }]}
                        />
                        <ProFormText
                          name={'path'}
                          label={'接口地址'}
                          rules={[
                            { required: true, message: '请输入接口路径' },
                            { max: 30, message: '接口路径不能超过 255 个字符' },
                          ]}
                        />
                        <ProFormTreeSelect
                          name={'groupId'}
                          label={'所属分组'}
                          rules={[{ required: true, message: '请选择接口分组' }]}
                          fieldProps={{ fieldNames: IdName, treeData: apiDocsGroup }}
                        />
                        <ProFormTextArea
                          name={'description'}
                          label={'描述'}
                          rules={[{ max: 255, message: '描述信息不能超过 255 个字符' }]}
                        />
                      </ModalForm>
                    ),
                  },
                ],
              }}
            >
              <Button icon={<PlusOutlined />} type={'text'} />
            </Dropdown>
          }
        >
          <Input.Search
            placeholder={'请输入接口名称'}
            enterButton
            onSearch={(name) => updateApiDocsGroupDetail(name)}
          />
          <Tree<ApiDocsGroupDetail>
            showIcon
            blockNode
            selectedKeys={[selectedNode?.groupInfo?.id || selectedNode?.apiDocsInfo?.id || 0]}
            style={{ paddingTop: 10 }}
            treeData={apiDocsGroupDetail}
            onSelect={(_, { selected, node }) => {
              if (!selected) {
                return;
              }
              setSelectedNode({ apiDocsInfo: node.apiDocsInfo, groupInfo: node.groupInfo });
            }}
          />
        </Card>
      </Col>
      <Col span={18}>
        {selectedNode?.groupInfo && (
          <>
            <Flex justify="space-between" align="center">
              <h3
                style={{
                  borderLeft: `3px solid ${token.colorPrimary}`,
                  paddingLeft: '8px',
                }}
              >
                {selectedNode.groupInfo.name}
                <span style={{ paddingLeft: 10, fontSize: 11, color: token.colorPrimary }}>
                  共{selectedNode.groupInfo.apiDocs?.length || 0}个接口
                </span>
              </h3>
              <Flex gap="middle">
                <ModalForm
                  width={630}
                  form={updateApiGroupForm}
                  labelCol={{ span: 4 }}
                  title={'编辑分组'}
                  layout="horizontal"
                  trigger={
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => updateApiGroupForm.setFieldsValue(selectedNode.groupInfo)}
                    >
                      编辑
                    </Button>
                  }
                  onFinish={async () => {
                    const values = await updateApiGroupForm.validateFields();
                    values.projectId = projectId;
                    values.id = selectedNode.groupInfo?.id;
                    return updateApiDocsGroup(values).then(() => {
                      updateApiDocsGroupDetail();
                      updateApiGroupForm.resetFields();
                      return true;
                    });
                  }}
                >
                  <ProFormText
                    name={'name'}
                    label={'分组名称'}
                    rules={[
                      { required: true, message: '请输入分组名称' },
                      { max: 30, message: '分组名称不能超过 30 个字符' },
                    ]}
                  />
                  <ProFormTreeSelect
                    allowClear
                    name={'parentId'}
                    label={'父分组'}
                    fieldProps={{ fieldNames: IdName, treeData: apiDocsGroup }}
                  />
                  <ProFormTextArea
                    name={'description'}
                    label={'描述'}
                    rules={[{ max: 255, message: '描述信息不能超过 255 个字符' }]}
                  />
                </ModalForm>
                <Popconfirm
                  title="删除接口分组"
                  description="确认删除该接口分组吗？"
                  onConfirm={() => {
                    if (selectedNode.groupInfo) {
                      deleteApiDocsGroup({ id: selectedNode.groupInfo.id }).then(() => {
                        updateApiDocsGroupDetail();
                        setSelectedNode(undefined);
                      });
                    }
                  }}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </Flex>
            </Flex>
            <p style={{ fontSize: 12 }}>描述：{selectedNode.groupInfo.description || '-'}</p>
            <Table
              bordered
              size="small"
              rowKey={'id'}
              pagination={false}
              columns={apiDocsTableColumns}
              dataSource={selectedNode.groupInfo.apiDocs}
            />
          </>
        )}
        {selectedNode?.apiDocsInfo && (
          <>
            <Tabs defaultActiveKey="preview" items={items} />
          </>
        )}
      </Col>
    </Row>
  );
}

export default Docs;
