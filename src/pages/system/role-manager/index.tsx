import React, { useEffect, useState } from 'react';
import {
  Card,
  PaginationProps,
  Button,
  Spin,
  Table,
  Modal,
  Typography,
} from '@arco-design/web-react';
import SearchForm from '@/pages/system/role-manager/search-form';
import { IconPlus } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import RoleForm, { RoleFormProps } from '@/components/RoleForm';
import {
  deleteRole,
  pageRole,
  saveRole,
  updateRole,
} from '@/service/system/quiet-role';
import { QuietRole } from '@/service/system/type';

function RoleManager() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
  });
  const [loading, setLoading] = useState(true);
  const [formParams, setFormParams] = useState({});
  const [roleFormProps, setRoleFormProps] = useState<RoleFormProps>({
    visible: false,
  });

  useEffect(() => {
    fetchData();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    setLoading(true);
    pageRole({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formParams,
    })
      .then((res) => {
        setData(res.content);
        setPagination((pre) => ({ ...pre, total: res.total_elements }));
      })
      .finally(() => setLoading(false));
  }

  function onChangeTable({ current, pageSize }) {
    setPagination({
      ...pagination,
      current,
      pageSize,
    });
  }

  function handleSearch(params) {
    setPagination({ ...pagination, current: 1 });
    setFormParams(params);
  }

  const columns: ColumnProps<QuietRole>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 185,
      render: (value) => <Typography.Text copyable>{value}</Typography.Text>,
    },
    {
      title: '角色名',
      dataIndex: 'role_name',
      width: 180,
    },
    {
      title: '角色中文名',
      dataIndex: 'role_cn_name',
      width: 180,
    },
    {
      title: '父角色 ID',
      dataIndex: 'parent_id',
      width: 185,
    },
    {
      title: '父角色名',
      dataIndex: 'parent_role_name',
      width: 180,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 300,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <div className={styles.operations}>
          <Button
            type="text"
            size="small"
            onClick={() =>
              setRoleFormProps({
                title: '更新角色',
                visible: true,
                roleInfo: record,
                onOk: async (values) => {
                  return await updateRole(values).then(() => {
                    fetchData();
                    setRoleFormProps({ visible: false });
                  });
                },
                onCancel: () => setRoleFormProps({ visible: false }),
              })
            }
          >
            修改
          </Button>
          <Button
            type="text"
            status="danger"
            size="small"
            onClick={() =>
              Modal.confirm({
                title: `确认删除角色 ${record.role_cn_name} 吗？`,
                onOk: () => deleteRole(record.id).then(() => fetchData()),
              })
            }
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card style={{ height: '80vh' }}>
      <SearchForm onSearch={handleSearch} />
      <div className={styles['button-group']}>
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={() =>
            setRoleFormProps({
              title: '新建角色',
              visible: true,
              onOk: (values) =>
                saveRole(values).then(() => {
                  fetchData();
                  setRoleFormProps({ visible: false });
                }),
              onCancel: () => setRoleFormProps({ visible: false }),
            })
          }
        >
          {'新建角色'}
        </Button>
      </div>
      <Spin style={{ width: '100%' }}>
        <Table
          rowKey="id"
          data={data}
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          scroll={{
            x: true,
            y: true,
          }}
        />
      </Spin>

      <RoleForm {...roleFormProps} />
    </Card>
  );
}

export default RoleManager;
