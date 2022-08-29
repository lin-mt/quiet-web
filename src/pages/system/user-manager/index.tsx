import React, { useEffect, useState } from 'react';
import {
  Card,
  PaginationProps,
  Button,
  Spin,
  Table,
  Space,
  Tag,
  Modal,
  Tooltip,
  Typography,
} from '@arco-design/web-react';
import SearchForm from '@/pages/system/user-manager/search-form';
import {
  addRoles,
  deleteUser,
  pageUser,
  registeredUser,
  removeRole,
  updateRoles,
  updateUser,
} from '@/service/system/quiet-user';
import { IconPlus } from '@arco-design/web-react/icon';
import { enabled, expired, locked } from '@/utils/render';
import styles from './style/index.module.less';
import { Gender, QuietUser } from '@/service/system/type';
import UserForm, { UserFormProps } from '@/components/UserForm';
import { ColumnProps } from '@arco-design/web-react/es/Table';

function UserManager() {
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
  const [userFormProps, setUserFormProps] = useState<UserFormProps>({
    visible: false,
  });

  useEffect(() => {
    fetchData();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  function fetchData() {
    setLoading(true);
    pageUser({
      current: pagination.current,
      page_size: pagination.pageSize,
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
      title: '角色',
      dataIndex: 'authorities',
      width: 200,
      render: (_, record) => (
        <Space direction={'vertical'}>
          {!(record.authorities && record.authorities.length > 0)
            ? '-'
            : record.authorities.map(({ id, role_name, role_cn_name }) => (
                <Tag
                  closable
                  key={id}
                  color={'rgb(var(--arcoblue-5))'}
                  onClose={() => {
                    return new Promise((resolve, reject) => {
                      Modal.confirm({
                        title: `确定删除用户 ${record.full_name} 的 ${role_cn_name} 角色吗？`,
                        onOk: () =>
                          removeRole(record.id, id).then(() => {
                            resolve(undefined);
                          }),
                        onCancel: () => reject(),
                      });
                    });
                  }}
                >
                  <Tooltip content={role_cn_name} key={role_name}>
                    {role_name.substring(5)}
                  </Tooltip>
                </Tag>
              ))}
        </Space>
      ),
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
      width: 150,
      render: (_, record) => (
        <div className={styles.operations}>
          <Button
            type="text"
            size="small"
            onClick={() =>
              setUserFormProps({
                title: '更新用户',
                visible: true,
                userInfo: record,
                accountConfigVisible: true,
                onOk: async (values, roleIds) => {
                  await updateRoles(record.id, roleIds);
                  return updateUser({ ...record, ...values }).then(() => {
                    fetchData();
                    setUserFormProps({ visible: false });
                  });
                },
                onCancel: () => setUserFormProps({ visible: false }),
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
                title: `确认删除用户 ${record.username} 吗？`,
                onOk: () => deleteUser(record.id).then(() => fetchData()),
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
            setUserFormProps({
              title: '注册',
              visible: true,
              accountConfigVisible: true,
              onOk: (values, roleIds) =>
                registeredUser(values).then(async (newUser) => {
                  const userRoles: { user_id: string; role_id: string }[] = [];
                  if (roleIds && roleIds.length > 0) {
                    roleIds.forEach((roleId) => {
                      userRoles.push({ user_id: newUser.id, role_id: roleId });
                    });
                    await addRoles(userRoles);
                  }
                  fetchData();
                  setUserFormProps({ visible: false });
                }),
              onCancel: () => setUserFormProps({ visible: false }),
            })
          }
        >
          {'创建用户'}
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

      <UserForm {...userFormProps} />
    </Card>
  );
}

export default UserManager;
