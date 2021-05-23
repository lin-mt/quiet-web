import React, { useEffect, useRef, useState } from 'react';
import { Button, Popconfirm, Space, Tag } from 'antd';
import { CloseOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ColumnsState, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  deleteRoute,
  pageRoute,
  removeFilter,
  removePredicate,
} from '@/services/system/QuietRoute';
import { PageContainer } from '@ant-design/pro-layout';
import RouteForm from '@/pages/system/route/components/RouteForm';
import type { QuietRoute } from '@/services/system/EntityType';
import { useModel } from 'umi';
import { DICTIONARY } from '@/constant/system/Modelnames';
import { DictionaryType } from '@/types/Type';

const GatewayRoute: React.FC<any> = () => {
  const { getDictionaryLabels } = useModel(DICTIONARY);

  const [updateRouteInfo, setUpdateRouteInfo] = useState<QuietRoute>();
  const [routeFormVisible, setRouteModalVisible] = useState<boolean>(false);
  const [environmentLabels, setEnvironmentLabels] = useState<Record<string, string>>({});
  const routeModalActionRef = useRef<ActionType>();

  useEffect(() => {
    getDictionaryLabels(DictionaryType.Environment).then((labels) => {
      setEnvironmentLabels(labels);
    });
  }, [getDictionaryLabels]);

  async function confirmRemoveRouteFilter(id: string, filter: string) {
    await removeFilter(id, filter);
    routeModalActionRef?.current?.reload();
  }

  async function confirmRemoveRoutePredicate(id: string, predicate: string) {
    await removePredicate(id, predicate);
    routeModalActionRef?.current?.reload();
  }

  const columns: ProColumns<QuietRoute>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      copyable: true,
    },
    {
      title: '路由ID',
      dataIndex: 'routeId',
      valueType: 'text',
    },
    {
      title: '环境',
      dataIndex: 'environment',
      valueType: 'text',
      valueEnum: environmentLabels,
    },
    {
      title: 'URI',
      dataIndex: 'uri',
      valueType: 'text',
    },
    {
      title: 'Predicates',
      dataIndex: 'scope',
      search: false,
      render: (_, record) => (
        <Space direction={'vertical'}>
          {record.predicates
            ? record.predicates.map((predicate) => (
                <Tag
                  color={'#108EE9'}
                  key={predicate}
                  closable={true}
                  onClose={(e) => e.preventDefault()}
                  closeIcon={
                    <Popconfirm
                      title={`确定移除路由 ${record.routeId} 的 Predicate 配置 ${predicate} 吗？`}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      /* eslint-disable-next-line @typescript-eslint/no-invalid-this */
                      onConfirm={confirmRemoveRoutePredicate.bind(this, record.id, predicate)}
                    >
                      <CloseOutlined />
                    </Popconfirm>
                  }
                >
                  {predicate}
                </Tag>
              ))
            : '-'}
        </Space>
      ),
    },
    {
      title: 'Filters',
      dataIndex: 'filters',
      search: false,
      render: (_, record) => (
        <Space direction={'vertical'}>
          {record.filters
            ? record.filters.map((filter) => (
                <Tag
                  color={'#108EE9'}
                  key={filter}
                  closable={true}
                  onClose={(e) => e.preventDefault()}
                  closeIcon={
                    <Popconfirm
                      title={`确定移除路由 ${record.routeId} 的 Filter 配置 ${filter} 吗？`}
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={confirmRemoveRouteFilter.bind(
                        /* eslint-disable-next-line @typescript-eslint/no-invalid-this */
                        this,
                        record.id,
                        filter,
                      )}
                    >
                      <CloseOutlined />
                    </Popconfirm>
                  }
                >
                  {filter}
                </Tag>
              ))
            : '-'}
        </Space>
      ),
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
              setUpdateRouteInfo({ ...record });
              setRouteModalVisible(true);
            }}
          >
            修改
          </a>,
          <Popconfirm
            key="delete"
            placement="topLeft"
            title="确认删除该路由配置吗？"
            onConfirm={() => {
              deleteRoute(record.id).then(() => routeModalActionRef?.current?.reload());
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
  });

  return (
    <PageContainer>
      <ProTable<QuietRoute>
        actionRef={routeModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => pageRoute({ params, sorter, filter })}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setUpdateRouteInfo(undefined);
              setRouteModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建路由配置
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {routeFormVisible && (
        <RouteForm
          visible={routeFormVisible}
          onCancel={() => setRouteModalVisible(false)}
          updateInfo={updateRouteInfo}
          afterAction={() => routeModalActionRef?.current?.reload()}
        />
      )}
    </PageContainer>
  );
};
export default GatewayRoute;
