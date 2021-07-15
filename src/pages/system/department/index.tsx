import React, { useRef, useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ColumnsState, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { deleteDepartment, pageDepartment } from '@/services/system/QuietDepartment';
import { PageContainer } from '@ant-design/pro-layout';
import DepartmentForm from '@/pages/system/department/components/DepartmentForm';
import DepartmentTree from '@/pages/system/department/components/DepartmentTree';
import DepartmentUser from '@/pages/system/department/components/DepartmentUser';
import type { QuietDepartment } from '@/services/system/EntityType';

const PermissionConfig: React.FC<any> = () => {
  const [updateDepartmentInfo, setUpdateDepartmentInfo] = useState<QuietDepartment>();
  const [departmentFormVisible, setDepartmentModalVisible] = useState<boolean>(false);
  const [departmentTreeVisible, setDepartmentTreeVisible] = useState<boolean>(false);
  const [departmentUserVisible, setDepartmentUserVisible] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<QuietDepartment>();
  const departmentModalActionRef = useRef<ActionType>();
  const columns: ProColumns<QuietDepartment>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      copyable: true,
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
          <a
            key="departmentUsers"
            onClick={() => {
              setDepartmentUserVisible(true);
              setSelectedDepartment(record);
            }}
          >
            部门成员
          </a>,
          <a
            key="update"
            onClick={() => {
              const role = { ...record };
              setUpdateDepartmentInfo(role);
              setDepartmentModalVisible(true);
            }}
          >
            修改
          </a>,
          <Popconfirm
            key="delete"
            placement="topLeft"
            title="确认删除该部门信息吗？"
            onConfirm={() => {
              deleteDepartment(record.id).then(() => refreshPageInfo());
            }}
          >
            <a key="delete">删除</a>
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

  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    gmtCreate: { show: false },
    gmtUpdate: { show: false },
  });

  function createDepartment() {
    setUpdateDepartmentInfo(undefined);
    setDepartmentModalVisible(true);
  }

  function showAllDepartmentByTree() {
    setDepartmentTreeVisible(true);
  }

  return (
    <PageContainer>
      <ProTable<QuietDepartment>
        actionRef={departmentModalActionRef}
        rowKey={(record) => record.id}
        request={(params, sorter, filter) => pageDepartment({ params, sorter, filter })}
        toolBarRender={() => [
          <Button type="primary" key="tree" onClick={showAllDepartmentByTree}>
            所有部门
          </Button>,
          <Button type="primary" key="create" onClick={createDepartment}>
            <PlusOutlined /> 新增部门
          </Button>,
        ]}
        columns={columns}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={(map) => setColumnsStateMap(map)}
      />
      {departmentFormVisible && (
        <DepartmentForm
          visible={departmentFormVisible}
          onCancel={handlePermissionFormCancel}
          updateInfo={updateDepartmentInfo}
          afterAction={refreshPageInfo}
        />
      )}
      {departmentTreeVisible && (
        <DepartmentTree
          multiple
          visible={departmentTreeVisible}
          onCancel={() => setDepartmentTreeVisible(false)}
          onOk={() => setDepartmentTreeVisible(false)}
        />
      )}
      {departmentUserVisible && (
        <DepartmentUser
          department={selectedDepartment}
          visible={departmentUserVisible}
          onCancel={() => setDepartmentUserVisible(false)}
          onOk={() => setDepartmentUserVisible(false)}
        />
      )}
    </PageContainer>
  );
};

export default PermissionConfig;
