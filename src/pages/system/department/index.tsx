import React, { useRef, useState } from 'react';
import { Button, Form, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable, { ActionType, ColumnsState, ProColumns } from '@ant-design/pro-table';
import { deleteDepartment, queryDepartment } from '@/services/system/QuiteDepartment';
import { PageContainer } from '@ant-design/pro-layout';
import { OperationType } from '@/types/Type';
import DepartmentForm from '@/pages/system/department/components/DepartmentForm';

const PermissionConfig: React.FC<any> = () => {
  const [updateDepartmentInfo, setUpdateDepartmentInfo] = useState<SystemEntities.QuiteDepartment>();
  const [departmentFormVisible, setDepartmentModalVisible] = useState<boolean>(false);
  const [departmentFormType, setDepartmentOperationType] = useState<OperationType>();
  const departmentModalActionRef = useRef<ActionType>();
  const [departmentForm] = Form.useForm();
  const columns: ProColumns<SystemEntities.QuiteDepartment>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '部门名称',
      dataIndex: 'departmentName',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '父级部门ID',
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
      valueType: 'option',
      render: (_, record) => {
        return [
          <a key='update' onClick={() => {
            const role = { ...record };
            departmentForm.setFieldsValue(role);
            setUpdateDepartmentInfo(role);
            setDepartmentOperationType(OperationType.UPDATE);
            setDepartmentModalVisible(true);
          }}>修改</a>,
          <Popconfirm
            key='delete'
            placement='topLeft'
            title='确认删除该部门信息吗？'
            onConfirm={() => {
              deleteDepartment(record.id).then(() => refreshPageInfo());
            }}
          >
            <a key='delete'>删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];

  function refreshPageInfo() {
    departmentModalActionRef?.current?.reload();
  }

  function handlePermissionFormCancel() {
    setDepartmentModalVisible(false);
  }

  const [columnsStateMap, setColumnsStateMap] = useState<{
    [key: string]: ColumnsState;
  }>({});

  function createDepartment() {
    setDepartmentOperationType(OperationType.CREATE);
    setDepartmentModalVisible(true);
  }

  return (
    <PageContainer>
      <ProTable<SystemEntities.QuiteDepartment>
        actionRef={departmentModalActionRef}
        rowKey={record => record.id}
        request={(params, sorter, filter) =>
          queryDepartment({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={createDepartment}>
            <PlusOutlined /> 新增部门
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {departmentFormVisible &&
      <DepartmentForm visible={departmentFormVisible} onCancel={handlePermissionFormCancel} form={departmentForm}
                      operationType={departmentFormType} updateInfo={updateDepartmentInfo}
                      afterAction={refreshPageInfo} />
      }
    </PageContainer>
  );
};

export default PermissionConfig;
