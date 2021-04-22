import React, { useRef, useState } from 'react';
import { Button, Form, Popconfirm, Space, Tag } from 'antd';
import { CloseOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  queryClient,
  deleteClient,
  removeClientAuthorizedGrantType,
  removeClientScope,
} from '@/services/system/QuietClient';
import { PageContainer } from '@ant-design/pro-layout';
import { OperationType } from '@/types/Type';
import ClientForm from '@/pages/system/client/components/ClientForm';
import { autoApproveStatus, scopedStatus, secretRequiredStatus } from '@/services/system/Status';

const ClientManagement: React.FC<any> = () => {
  const [updateClientInfo, setUpdateClientInfo] = useState<SystemEntities.QuietClient>();
  const [clientFormVisible, setClientModalVisible] = useState<boolean>(false);
  const [clientFormType, setClientOperationType] = useState<OperationType>();
  const clientModalActionRef = useRef<ActionType>();
  const [clientForm] = Form.useForm();

  async function confirmRemoveClientAuthorizedGrantType(id: string, authorizedGrantType: string) {
    await removeClientAuthorizedGrantType(id, authorizedGrantType);
    refreshPageInfo();
  }

  async function confirmRemoveClientScope(id: string, scope: string) {
    await removeClientScope(id, scope);
    refreshPageInfo();
  }

  const columns: ProColumns<SystemEntities.QuietClient>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      copyable: true,
    },
    {
      title: '客户端ID',
      dataIndex: 'clientId',
      valueType: 'text',
    },
    {
      title: '名称',
      dataIndex: 'clientName',
      valueType: 'text',
    },
    {
      title: '需要认证',
      dataIndex: 'secretRequired',
      valueType: 'select',
      valueEnum: secretRequiredStatus,
    },
    {
      title: '自动授权',
      dataIndex: 'autoApprove',
      valueType: 'select',
      valueEnum: autoApproveStatus,
    },
    {
      title: '范围限制',
      dataIndex: 'scoped',
      valueType: 'select',
      valueEnum: scopedStatus,
    },
    {
      title: '授权范围',
      dataIndex: 'scope',
      render: (_, record) => (
        <Space direction={'vertical'}>
          {record.scope
            ? record.scope.map((scope) => (
                <Tag
                  color={'#108EE9'}
                  key={scope}
                  closable={true}
                  onClose={(e) => e.preventDefault()}
                  closeIcon={
                    <Popconfirm
                      title={`确定移除 ${record.clientName} 的 ${scope} 授权范围吗？`}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      /* eslint-disable-next-line @typescript-eslint/no-invalid-this */
                      onConfirm={confirmRemoveClientScope.bind(this, record.id, scope)}
                    >
                      <CloseOutlined />
                    </Popconfirm>
                  }
                >
                  {scope}
                </Tag>
              ))
            : '-'}
        </Space>
      ),
    },
    {
      title: '授权类型',
      dataIndex: 'authorizedGrantTypes',
      search: false,
      render: (_, record) => (
        <Space direction={'vertical'}>
          {record.authorizedGrantTypes
            ? record.authorizedGrantTypes.map((authorizedGrantType) => (
                <Tag
                  color={'#108EE9'}
                  key={authorizedGrantType}
                  closable={true}
                  onClose={(e) => e.preventDefault()}
                  closeIcon={
                    <Popconfirm
                      title={`确定移除 ${record.clientName} 的 ${authorizedGrantType} 授权类型吗？`}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={confirmRemoveClientAuthorizedGrantType.bind(
                        /* eslint-disable-next-line @typescript-eslint/no-invalid-this */
                        this,
                        record.id,
                        authorizedGrantType,
                      )}
                    >
                      <CloseOutlined />
                    </Popconfirm>
                  }
                >
                  {authorizedGrantType}
                </Tag>
              ))
            : '-'}
        </Space>
      ),
    },
    {
      title: 'token有效期',
      dataIndex: 'accessTokenValiditySeconds',
      valueType: 'digit',
      search: false,
    },
    {
      title: '刷新token的有效期',
      dataIndex: 'refreshTokenValiditySeconds',
      valueType: 'digit',
      search: false,
    },
    {
      title: '资源ID',
      key: 'resourceIds',
      dataIndex: 'resourceIds',
      valueType: 'text',
      search: false,
    },
    {
      title: '重定向Uri',
      key: 'registeredRedirectUri',
      dataIndex: 'registeredRedirectUri',
      valueType: 'text',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtUpdate',
      key: 'gmtUpdate',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 120,
      valueType: 'option',
      render: (_, record) => {
        return [
          <a
            key="update"
            onClick={() => {
              const client = { ...record };
              clientForm.setFieldsValue(client);
              setUpdateClientInfo(client);
              setClientOperationType(OperationType.UPDATE);
              setClientModalVisible(true);
            }}
          >
            修改
          </a>,
          <Popconfirm
            key="delete"
            placement="topLeft"
            title="确认删除该客户端吗？"
            onConfirm={() => {
              deleteClient(record.id).then(() => refreshPageInfo());
            }}
          >
            <a key="delete">删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];
  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    gmtCreate: { show: false },
    gmtUpdate: { show: false },
    resourceIds: { show: false },
    registeredRedirectUri: { show: false },
  });

  function createClient() {
    setClientOperationType(OperationType.CREATE);
    setClientModalVisible(true);
  }

  function handleClientFormCancel() {
    setClientModalVisible(false);
  }

  function refreshPageInfo() {
    clientModalActionRef?.current?.reload();
  }

  return (
    <PageContainer>
      <ProTable<SystemEntities.QuietClient>
        actionRef={clientModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => queryClient({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={createClient}>
            <PlusOutlined /> 新建客户端
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {clientFormVisible && (
        <ClientForm
          visible={clientFormVisible}
          onCancel={handleClientFormCancel}
          operationType={clientFormType}
          form={clientForm}
          updateInfo={updateClientInfo}
          afterAction={refreshPageInfo}
        />
      )}
    </PageContainer>
  );
};
export default ClientManagement;
