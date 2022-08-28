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
import SearchForm from '@/pages/system/dept-manager/search-form';
import { IconPlus } from '@arco-design/web-react/icon';
import styles from './style/index.module.less';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import {
  deleteDept,
  pageDept,
  saveDept,
  updateDept,
} from '@/service/system/quiet-dept';
import DeptForm, { DeptFormProps } from '@/components/DeptForm';
import { QuietDept } from '@/service/system/type';

function DeptManager() {
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
  const [deptFormProps, setDeptFormProps] = useState<DeptFormProps>({
    visible: false,
  });

  useEffect(() => {
    fetchData();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    setLoading(true);
    pageDept({
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

  const columns: ColumnProps<QuietDept>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 185,
      render: (value) => <Typography.Text copyable>{value}</Typography.Text>,
    },
    {
      title: '部门名称',
      dataIndex: 'dept_name',
      width: 180,
    },
    {
      title: '父部门 ID',
      dataIndex: 'parent_id',
      width: 185,
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
              setDeptFormProps({
                title: '更新部门',
                visible: true,
                deptInfo: record,
                onOk: async (values) => {
                  return await updateDept(values).then(() => {
                    fetchData();
                    setDeptFormProps({ visible: false });
                  });
                },
                onCancel: () => setDeptFormProps({ visible: false }),
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
                title: `确认删除部门 ${record.dept_name} 吗？`,
                onOk: () => deleteDept(record.id).then(() => fetchData()),
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
            setDeptFormProps({
              title: '新建部门',
              visible: true,
              onOk: (values) =>
                saveDept(values).then(() => {
                  fetchData();
                  setDeptFormProps({ visible: false });
                }),
              onCancel: () => setDeptFormProps({ visible: false }),
            })
          }
        >
          {'新建部门'}
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

      <DeptForm {...deptFormProps} />
    </Card>
  );
}

export default DeptManager;
