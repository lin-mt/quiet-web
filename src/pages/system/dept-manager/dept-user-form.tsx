import React, { useEffect, useState } from 'react';
import {
  Card,
  PaginationProps,
  Button,
  Spin,
  Table,
  Modal,
  Typography,
  Grid,
  Message,
} from '@arco-design/web-react';
import SearchForm from '@/pages/system/user-manager/search-form';
import { enabled, expired, locked } from '@/utils/render';
import styles from './style/index.module.less';
import { Gender, QuietDept, QuietUser } from '@/service/system/type';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import {
  addUsers,
  pageDeptUser,
  removeUsers,
} from '@/service/system/quiet-dept';
import { IconPlus } from '@arco-design/web-react/icon';
import UserSelect from '@/components/UserSelect';

export type DeptUserFormProps = {
  dept?: QuietDept;
  title?: string;
  visible?: boolean;
  okText?: string;
  onOk?: () => void;
  cancelText?: string;
  onCancel?: () => void;
};

function DeptUserForm(props: DeptUserFormProps) {
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
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    fetchData();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    setLoading(true);
    pageDeptUser({
      id: props.dept.id,
      current: pagination.current,
      page_size: pagination.pageSize,
      params: { ...formParams },
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

  function addDeptUser() {
    addUsers(props.dept.id, selectedUserIds).then(() => {
      Message.success('添加成功');
      fetchData();
      setSelectedUserIds([]);
    });
  }

  const columns: ColumnProps<QuietUser>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 180,
      render: (value) => <Typography.Text copyable>{value}</Typography.Text>,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 130,
    },
    {
      title: '姓名',
      dataIndex: 'full_name',
      width: 130,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 60,
      render: (val) => Gender[val],
    },
    {
      title: '电话号码',
      dataIndex: 'phone_number',
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email_address',
      width: 200,
    },
    {
      title: '账号期限',
      dataIndex: 'account_expired',
      width: 100,
      render: (val) => expired(val),
    },
    {
      title: '账号状态',
      dataIndex: 'account_locked',
      width: 100,
      render: (val) => locked(val),
    },
    {
      title: '密码期限',
      dataIndex: 'credentials_expired',
      width: 100,
      render: (val) => expired(val),
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      width: 100,
      render: (val) => enabled(val),
    },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right',
      width: 92,
      render: (_, record) => (
        <div className={styles.operations}>
          <Button
            type="text"
            size="small"
            onClick={() =>
              Modal.confirm({
                title: `确定将成员 ${record.full_name} 移出部门 ${props.dept.dept_name} 吗？`,
                onOk: () =>
                  removeUsers(props.dept.id, [record.id]).then(() =>
                    fetchData()
                  ),
              })
            }
          >
            移除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      footer={null}
      escToExit
      style={{ width: '90%' }}
      title={props.title}
      visible={props.visible}
      onOk={props.onOk}
      onCancel={props.onCancel}
      okText={props.okText}
      cancelText={props.cancelText}
    >
      <Card style={{ height: '80vh' }}>
        <SearchForm onSearch={handleSearch} />
        <div className={styles['button-group']}>
          <Grid.Row style={{ width: '100%' }}>
            <Grid.Col span={10}>
              <UserSelect
                showSearch
                mode={'multiple'}
                value={selectedUserIds}
                onChange={(value) => setSelectedUserIds(value)}
                placeholder={'请输入用户名/姓名'}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Button
                type="primary"
                icon={<IconPlus />}
                className={styles['add-dept-user']}
                onClick={() => addDeptUser()}
              >
                {'添加成员'}
              </Button>
            </Grid.Col>
          </Grid.Row>
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
      </Card>
    </Modal>
  );
}

export default DeptUserForm;
