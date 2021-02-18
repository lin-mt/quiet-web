import React, { useRef, useState } from 'react';
import { Button, Form, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryDataDictionary, deleteDataDictionary } from '@/services/system/QuietDataDictionary';
import { PageContainer } from '@ant-design/pro-layout';
import { OperationType } from '@/types/Type';
import DataDictionaryTree from '@/pages/system/dataDictionary/components/DataDictionaryTree';
import DataDictionaryForm from '@/pages/system/dataDictionary/components/DataDictionaryForm';

const DataDictionary: React.FC<any> = () => {
  const [
    updateDataDictionaryInfo,
    setUpdateDataDictionaryInfo,
  ] = useState<SystemEntities.QuietDataDictionary>();
  const [dataDictionaryFormVisible, setDataDictionaryFormVisible] = useState<boolean>(false);
  const [dataDictionaryTreeVisible, setDataDictionaryTreeVisible] = useState<boolean>(false);

  const [
    dataDictionaryFormOperationType,
    setDataDictionaryFormOperationType,
  ] = useState<OperationType>();
  const dataDictionaryModalActionRef = useRef<ActionType>();
  const [dataDictionaryForm] = Form.useForm();
  const columns: ProColumns<SystemEntities.QuietDataDictionary>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      copyable: true,
    },
    {
      title: '字典类型',
      dataIndex: 'type',
      valueType: 'text',
    },
    {
      title: 'key',
      dataIndex: 'key',
      valueType: 'text',
    },
    {
      title: 'value',
      dataIndex: 'value',
      valueType: 'text',
    },
    {
      title: '父 ID',
      dataIndex: 'parentId',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'text',
      ellipsis: true,
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
              const dataDictionary = { ...record };
              dataDictionaryForm.setFieldsValue(dataDictionary);
              setUpdateDataDictionaryInfo(dataDictionary);
              setDataDictionaryFormOperationType(OperationType.UPDATE);
              setDataDictionaryFormVisible(true);
            }}
          >
            修改
          </a>,
          <Popconfirm
            key="delete"
            placement="topLeft"
            title="确认删除该数据字典吗？"
            onConfirm={() => {
              deleteDataDictionary(record.id).then(() => refreshPageInfo());
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

  function createDataDictionary() {
    setDataDictionaryFormOperationType(OperationType.CREATE);
    setDataDictionaryFormVisible(true);
  }

  function handleDataDictionaryFormCancel() {
    setDataDictionaryFormVisible(false);
  }

  function refreshPageInfo() {
    dataDictionaryModalActionRef?.current?.reload();
  }

  function showDataDictionaryByTree() {
    setDataDictionaryTreeVisible(true);
  }

  return (
    <PageContainer>
      <ProTable<SystemEntities.QuietDataDictionary>
        actionRef={dataDictionaryModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => queryDataDictionary({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="tree" onClick={showDataDictionaryByTree}>
            所有数据字典
          </Button>,
          <Button type="primary" key="create" onClick={createDataDictionary}>
            <PlusOutlined /> 新建数据字典
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {dataDictionaryFormVisible && (
        <DataDictionaryForm
          visible={dataDictionaryFormVisible}
          onCancel={handleDataDictionaryFormCancel}
          operationType={dataDictionaryFormOperationType}
          form={dataDictionaryForm}
          updateInfo={updateDataDictionaryInfo}
          afterAction={refreshPageInfo}
        />
      )}
      {dataDictionaryTreeVisible && (
        <DataDictionaryTree
          multiple
          visible={dataDictionaryTreeVisible}
          onCancel={() => setDataDictionaryTreeVisible(false)}
          onOk={() => setDataDictionaryTreeVisible(false)}
        />
      )}
    </PageContainer>
  );
};

export default DataDictionary;
