import React, { useRef, useState } from 'react';
import { Button, Form, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ColumnsState } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { pageDictionary, deleteDictionary } from '@/services/system/QuietDictionary';
import { PageContainer } from '@ant-design/pro-layout';
import { OperationType } from '@/types/Type';
import DictionaryTree from '@/pages/system/dictionary/components/DictionaryTree';
import DictionaryForm from '@/pages/system/dictionary/components/DictionaryForm';
import type { QuietDictionary } from '@/services/system/EntityType';

const Dictionary: React.FC<any> = () => {
  const [updateDictionaryInfo, setUpdateDictionaryInfo] = useState<QuietDictionary>();
  const [dictionaryFormVisible, setDictionaryFormVisible] = useState<boolean>(false);
  const [dictionaryTreeVisible, setDictionaryTreeVisible] = useState<boolean>(false);

  const [dictionaryFormOperationType, setDictionaryFormOperationType] = useState<OperationType>();
  const dictionaryModalActionRef = useRef<ActionType>();
  const [dictionaryForm] = Form.useForm();
  const columns: ProColumns<QuietDictionary>[] = [
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
      title: 'label',
      dataIndex: 'label',
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
              const dictionary = { ...record };
              dictionaryForm.setFieldsValue(dictionary);
              setUpdateDictionaryInfo(dictionary);
              setDictionaryFormOperationType(OperationType.UPDATE);
              setDictionaryFormVisible(true);
            }}
          >
            修改
          </a>,
          <Popconfirm
            key="delete"
            placement="topLeft"
            title="确认删除该数据字典吗？"
            onConfirm={() => {
              deleteDictionary(record.id).then(() => refreshPageInfo());
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

  function createDictionary() {
    setDictionaryFormOperationType(OperationType.CREATE);
    setDictionaryFormVisible(true);
  }

  function handleDictionaryFormCancel() {
    setDictionaryFormVisible(false);
  }

  function refreshPageInfo() {
    dictionaryModalActionRef?.current?.reload();
  }

  function showDictionaryByTree() {
    setDictionaryTreeVisible(true);
  }

  return (
    <PageContainer>
      <ProTable<QuietDictionary>
        actionRef={dictionaryModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => pageDictionary({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="tree" onClick={showDictionaryByTree}>
            所有数据字典
          </Button>,
          <Button type="primary" key="create" onClick={createDictionary}>
            <PlusOutlined /> 新建数据字典
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {dictionaryFormVisible && (
        <DictionaryForm
          visible={dictionaryFormVisible}
          onCancel={handleDictionaryFormCancel}
          operationType={dictionaryFormOperationType}
          form={dictionaryForm}
          updateInfo={updateDictionaryInfo}
          afterAction={refreshPageInfo}
        />
      )}
      {dictionaryTreeVisible && (
        <DictionaryTree
          multiple
          visible={dictionaryTreeVisible}
          onCancel={() => setDictionaryTreeVisible(false)}
          onOk={() => setDictionaryTreeVisible(false)}
        />
      )}
    </PageContainer>
  );
};

export default Dictionary;
